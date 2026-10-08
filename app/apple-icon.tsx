import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/* The same mark as app/icon.svg, rendered as the 180 x 180 Home Screen icon. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d192c" }}>
        <svg width="132" height="132" viewBox="0 0 64 64">
          <path d="M17 46V18h8l14 18V18h8v28h-8L25 28v18z" fill="#00fff8" />
        </svg>
      </div>
    ),
    size,
  );
}
