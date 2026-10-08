import { ImageResponse } from "next/og";

export const alt = "NFT Preview Card: the Equilibrium #3429 artwork card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d192c" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 820, padding: 64, borderRadius: 40, background: "#15263f" }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#ffffff" }}>Equilibrium #3429</div>
          <div style={{ marginTop: 24, fontSize: 36, color: "#8bacd9" }}>Our Equilibrium collection promotes balance and calm.</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 32, borderTop: "2px solid #2e405a", fontSize: 34 }}>
            <div style={{ color: "#00fff8", fontWeight: 700 }}>0.041 ETH</div>
            <div style={{ color: "#8bacd9" }}>3 days left</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
