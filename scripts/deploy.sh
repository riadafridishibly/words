#!/usr/bin/env bash
#
# Build the app and publish dist/ to the gh-pages branch.
#
# GitHub Pages for this repo serves from the gh-pages branch root
# (https://riad.run/words/). This script rebuilds the production bundle and
# replaces that branch's contents with the fresh build, then pushes.
#
# The build uses a relative base ("./") + hash routing (see vite.config.js),
# so it works unchanged at the /words/ sub-path with no SPA refresh 404s.
#
# Usage:
#   scripts/deploy.sh                 # test, build, then deploy via `origin`
#   scripts/deploy.sh --skip-tests    # skip the test gate
#   REMOTE=personal scripts/deploy.sh # push to a different remote
#
set -euo pipefail

BRANCH="gh-pages"
DIST="dist"

# Run from the repo root regardless of where the script is invoked.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Pick the remote: explicit $REMOTE, else `origin`, else the only one defined.
if [ -z "${REMOTE:-}" ]; then
  if git remote | grep -qx origin; then
    REMOTE="origin"
  elif [ "$(git remote | wc -l | tr -d ' ')" = "1" ]; then
    REMOTE="$(git remote)"
  else
    echo "error: no 'origin' remote; set REMOTE=<name> (have: $(git remote | paste -sd, -))" >&2
    exit 1
  fi
fi

SKIP_TESTS=0
for arg in "$@"; do
  case "$arg" in
    --skip-tests) SKIP_TESTS=1 ;;
    -h|--help) sed -n '2,16p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) echo "error: unknown option '$arg' (try --help)" >&2; exit 1 ;;
  esac
done

if [ "$SKIP_TESTS" -eq 0 ]; then
  echo "==> Running tests"
  npm test
fi

echo "==> Building"
npm run build

# Publish dist/ to gh-pages through a throwaway worktree so the main working
# tree (on its own branch) is never touched.
WORKTREE="$(mktemp -d)"
cleanup() {
  git worktree remove --force "$WORKTREE" 2>/dev/null || true
  rm -rf "$WORKTREE"
}
trap cleanup EXIT

echo "==> Fetching $REMOTE/$BRANCH"
git fetch "$REMOTE" "$BRANCH"
git worktree add --force --detach "$WORKTREE" "$REMOTE/$BRANCH"

echo "==> Syncing build into $BRANCH"
# Wipe the old published files (keep .git), then drop the fresh build in.
find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R "$DIST"/. "$WORKTREE"/
touch "$WORKTREE/.nojekyll"   # tell Pages not to run Jekyll over the build

git -C "$WORKTREE" add -A
if git -C "$WORKTREE" diff --cached --quiet; then
  echo "==> No changes to deploy"
  exit 0
fi

SHA="$(git rev-parse --short HEAD)"
git -C "$WORKTREE" commit -q -m "Deploy build from ${SHA}"
echo "==> Pushing to $REMOTE/$BRANCH"
git -C "$WORKTREE" push "$REMOTE" "HEAD:$BRANCH"

echo "==> Done. Pages will rebuild shortly — https://riad.run/words/"
