interface WordmarkProps {
  size?: number;
  dark?: boolean;
}

export default function Wordmark({ size = 16, dark = true }: WordmarkProps) {
  const color = dark ? "#ffffff" : "#0F0F0F";

  return (
    <span
      style={{
        fontFamily: "var(--font-syne), 'Syne', sans-serif",
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.03em",
        color,
        lineHeight: 1,
      }}
    >
      Unfiltered
      <span style={{ opacity: 0.22 }}>U</span>
      <sup style={{ fontSize: "0.5em" }}>™</sup>
    </span>
  );
}
