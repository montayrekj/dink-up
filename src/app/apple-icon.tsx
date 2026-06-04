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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          borderRadius: "36px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "#facc15",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Pickleball holes */}
          <svg
            viewBox="0 0 130 130"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <circle cx="47" cy="30" r="6" fill="rgba(0,0,0,0.2)" />
            <circle cx="83" cy="30" r="6" fill="rgba(0,0,0,0.2)" />
            <circle cx="27" cy="53" r="6" fill="rgba(0,0,0,0.2)" />
            <circle cx="65" cy="50" r="6" fill="rgba(0,0,0,0.2)" />
            <circle cx="103" cy="53" r="6" fill="rgba(0,0,0,0.2)" />
            <circle cx="30" cy="80" r="6" fill="rgba(0,0,0,0.2)" />
            <circle cx="65" cy="80" r="6" fill="rgba(0,0,0,0.2)" />
            <circle cx="101" cy="80" r="6" fill="rgba(0,0,0,0.2)" />
            <circle cx="47" cy="101" r="6" fill="rgba(0,0,0,0.2)" />
            <circle cx="83" cy="101" r="6" fill="rgba(0,0,0,0.2)" />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
