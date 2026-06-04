import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          borderRadius: "6px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#facc15",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 26 26"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <circle cx="9.5"  cy="6.5" r="1.6" fill="rgba(0,0,0,0.22)" />
            <circle cx="16.5" cy="6.5" r="1.6" fill="rgba(0,0,0,0.22)" />
            <circle cx="5"    cy="11"  r="1.6" fill="rgba(0,0,0,0.22)" />
            <circle cx="13"   cy="10"  r="1.6" fill="rgba(0,0,0,0.22)" />
            <circle cx="21"   cy="11"  r="1.6" fill="rgba(0,0,0,0.22)" />
            <circle cx="5.5"  cy="16"  r="1.6" fill="rgba(0,0,0,0.22)" />
            <circle cx="13"   cy="16"  r="1.6" fill="rgba(0,0,0,0.22)" />
            <circle cx="20.5" cy="16"  r="1.6" fill="rgba(0,0,0,0.22)" />
            <circle cx="9.5"  cy="20"  r="1.6" fill="rgba(0,0,0,0.22)" />
            <circle cx="16.5" cy="20"  r="1.6" fill="rgba(0,0,0,0.22)" />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
