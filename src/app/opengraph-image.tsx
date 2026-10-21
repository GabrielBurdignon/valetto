import { ImageResponse } from "next/og";
export const alt = "VALETTO — Sua moto precisa ir. Você não.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#08090b",
        color: "#f5f5f3",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 70,
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 24, letterSpacing: 10 }}>VALETTO</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 80,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        <span>Sua moto precisa ir.</span>
        <span style={{ color: "#a7adb5" }}>Você não.</span>
      </div>
      <div style={{ fontSize: 18, letterSpacing: 3 }}>
        MOTORCYCLE CONCIERGE · BELO HORIZONTE
      </div>
    </div>,
    size,
  );
}
