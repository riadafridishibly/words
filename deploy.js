const ghpages = require("gh-pages");

ghpages.publish("out", {
  nojekyll: true,
  branch: "gh-pages",
  history: false,
});
