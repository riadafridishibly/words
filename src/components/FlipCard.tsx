import React from "react";

const flipCardStyle: React.CSSProperties = {
  //   backgroundColor: "transparent",
  width: "100%",
  height: "100%",
  perspective: "1000px",
  fontFamily: "sans-serif",
};

const flipCardInnerStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  textAlign: "center",
  transition: "transform 0.8s",
  transformStyle: "preserve-3d",
};

const flipCard: React.CSSProperties = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
};

export default function FlipCard({
  front,
  back,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={() => {
        setIsFlipped((v) => !v);
      }}
      style={{
        ...flipCardStyle,
      }}
    >
      <div
        style={{
          ...flipCardInnerStyle,
          transform: isFlipped ? "rotateY(180deg)" : undefined,
        }}
      >
        {/* front */}
        <div style={flipCard}>{front}</div>
        {/* back */}
        <div style={{ ...flipCard, transform: "rotateY(180deg)" }}>{back}</div>
      </div>
    </div>
  );
}
