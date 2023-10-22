import React from "react";
import "./budgets.css";
import tinycolor from "tinycolor2";

export const BoxyRadialProgress = ({ progress = 0, color }) => {
  const RADIUS = 30;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const percent = Math.min(Math.max(progress, 0), 100);  // Ensure the percentage is between 0 and 100
  const strokeDashOffset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  const originalColor = tinycolor(color);
  const baseColor = tinycolor(color).darken(0).toString();
  const darkenedColor = originalColor.darken(10).toString();

  return (
    <svg
      className="steps-step"
      fill="none"
      height="118"
      viewBox="0 0 118 118"
      width="118"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className="rect"
        fill="none"
        height="112"
        rx="40"
        stroke="var(--third-text-color)"
        strokeWidth="4.5"
        width="113"
        x="2.25"
        y="3.5"
      />
      <mask
        className="mask"
        height="99"
        id="mask0_112_71"
        maskUnits="userSpaceOnUse"
        width="99"
        x="9"
        y="9"
      >
        <rect className="rect" fill="#ffffff" height="99" rx="35" width="99" x="9" y="9" />
      </mask>
      <g className="g" mask="url(#mask0_112_71)" transform="rotate(270 59 59)">
        <circle
          cx="59"
          cy="59"
          r={RADIUS}
          fill="none"
          stroke={baseColor}
          strokeWidth="90"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashOffset}
          z-index="-5"
        />
        <circle
          className="overlap-circle"
          cx="59"
          cy="59"
          r={RADIUS - 10}
          fill="var(--primary-color)"
        />
        <circle
          cx="59"
          cy="59"
          r="14"
          fill={darkenedColor}
        />
      </g>
    </svg>
  );
};

