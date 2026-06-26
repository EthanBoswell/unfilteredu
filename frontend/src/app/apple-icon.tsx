import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F0F0F",
          borderRadius: 34,
          position: "relative",
          display: "flex",
        }}
      >
        <div style={{ position: "absolute", left: 37, top: 28, width: 31, height: 90, background: "#fff" }} />
        <div style={{ position: "absolute", left: 112, top: 28, width: 31, height: 90, background: "#fff" }} />
        <div
          style={{
            position: "absolute",
            left: 37,
            top: 101,
            width: 107,
            height: 39,
            borderRadius: 20,
            background: "#fff",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 132,
            top: 20,
            width: 28,
            height: 28,
            borderRadius: 14,
            background: "rgba(255,255,255,0.25)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
