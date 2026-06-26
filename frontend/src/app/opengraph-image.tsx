import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F0F0F",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", fontSize: 96, fontWeight: 800, color: "#fff" }}>
          Unfiltered<span style={{ opacity: 0.35 }}>U</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#888", marginTop: 24 }}>
          Real students · Real posts · No marketing
        </div>
      </div>
    ),
    { ...size }
  );
}
