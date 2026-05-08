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
          {/* Pickleball curve lines */}
          <svg
            viewBox="0 0 130 130"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <path
              d="M65 5 Q40 35 65 65 Q90 95 65 125"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M5 65 Q35 40 65 65 Q95 90 125 65"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
