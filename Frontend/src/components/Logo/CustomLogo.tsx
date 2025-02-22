import { rem } from "@mantine/core";
import React from "react";

// Define props for CustomLogo
export interface CustomLogoProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
  type?: "full" | "mark"; // "full" (default) shows logo + text, "mark" shows only logo
}

// CustomLogo component
export function CustomLogo({
  size = 30,
  type = "full",
  ...props
}: CustomLogoProps) {
  // Calculate text size based on logo size (relative to 30px default size)
  const textSize = typeof size === "number" ? rem(size * 0.5) : rem(30 * 0.5); // Adjust 0.4 as necessary

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Logo SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...props}
      >
        <style type="text/css">
          {`
            .st0{opacity:0.5;}
            .st1{fill:#B2B1CF;}
            .st2{fill:#EF1D1D;stroke:#000000;stroke-miterlimit:10;}
            .st3{fill:#C60D09;}
            .st4{opacity:0.5;fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;enable-background:new;}
            .st5{fill:#FFFFFF;stroke:#000000;stroke-miterlimit:10;}
            .st6{opacity:0.5;fill:none;stroke:#F79292;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
            .st7{fill:#EDC620;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
            .st8{fill:#EF1D1D;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
            .st9{opacity:0.5;fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;enable-background:new;}
            .st10{fill:#8E8EB2;}
          `}
        </style>
        <g className="st0">
          <path
            className="st1"
            d="M50,22v28.2c0,1.7-1.3,2.9-2.9,2.9h2c1.7,0,2.9-1.3,2.9-2.9V22H50z"
          />
        </g>
        <path
          className="st2"
          d="M11.5,21.5V14c0-2,1.5-3.5,3.5-3.5h34c2,0,3.5,1.5,3.5,3.5v7.5H11.5z"
        />
        <path
          className="st3"
          d="M49,11h-2c1.7,0,3,1.3,3,3v7h2v-7C52,12.3,50.7,11,49,11z"
        />
        <path className="st4" d="M50,17c0,1.1-0.9,2-2,2" />
        <path className="st4" d="M14,17.6V15c0-1.1,0.9-2,2-2" />
        <path
          className="st5"
          d="M14.9,53.5c-1.9,0-3.4-1.5-3.4-3.4l0-28.6h41l0,28.6c0,1.9-1.5,3.4-3.4,3.4H14.9L14.9,53.5z"
        />
        <path className="st6" d="M14,40V26" />
        <line className="st6" x1="14" x2="14" y1="48" y2="45" />
        <path className="st6" d="M50,49c0,1.1-0.9,2-2,2" />
        <path
          className="st7"
          d="M37,33c-1.4,0-2.5,1.1-2.5,2.5v-5c0-1.4-1.1-2.5-2.5-2.5c-1.4,0-2.5,1.1-2.5,2.5V33c0-1.4-1.1-2.5-2.5-2.5  s-2.5,1.1-2.5,2.5v3.3V40l0,0l0,0l0,0c0,4.1,3.4,7.5,7.5,7.5s7.5-3.3,7.5-7.5l0,0l0,0l0,0v-1.7v-2.8C39.5,34.1,38.4,33,37,33z"
        />
        <path
          className="st8"
          d="M34,38.2L34,38.2c-0.6,0-1,0.4-1,1v-1.7c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1v0.9c0-0.6-0.4-1-1-1l0,0  c-0.6,0-1,0.4-1,1v3.1l0,0c0,1.7,1.3,3,3,3s3-1.3,3-3l0,0v-2.3C35,38.6,34.6,38.2,34,38.2z"
        />
      </svg>
      {/* Show text only when type="full" */}
      {type === "full" && (
        <span
          style={{
            fontSize: textSize,
            fontWeight: "bold",
            userSelect: "none", // Prevent text selection
          }}
        >
          Bookify
        </span>
      )}
    </div>
  );
}
