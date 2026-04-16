import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          {/* Wave arcs matching the Outlynk logo icon */}
          <path
            d="M9 21 C4 17 4 11 9 7"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M13 24 C5 19 5 9 13 4"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M17 26 C6 20 6 8 17 2"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
