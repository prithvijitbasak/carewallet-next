import React from "react";

interface LoaderProps {
  className?: string;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  className = "w-10 h-10",
  color = "#FF0000",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={className}
    >
      <radialGradient
        id="a18"
        cx=".66"
        fx=".66"
        cy=".3125"
        fy=".3125"
        gradientTransform="scale(1.5)"
      >
        <stop offset="0" stopColor={color}></stop>
        <stop offset=".3" stopColor={color} stopOpacity=".9"></stop>
        <stop offset=".6" stopColor={color} stopOpacity=".6"></stop>
        <stop offset=".8" stopColor={color} stopOpacity=".3"></stop>
        <stop offset="1" stopColor={color} stopOpacity="0"></stop>
      </radialGradient>

      <circle
        style={{ transformOrigin: "center" }}
        fill="none"
        stroke="url(#a18)"
        strokeWidth="15"
        strokeLinecap="round"
        strokeDasharray="200 1000"
        strokeDashoffset="0"
        cx="100"
        cy="100"
        r="70"
      >
        <animateTransform
          type="rotate"
          attributeName="transform"
          calcMode="spline"
          dur="2"
          values="360;0"
          keyTimes="0;1"
          keySplines="0 0 1 1"
          repeatCount="indefinite"
        ></animateTransform>
      </circle>

      <circle
        style={{ transformOrigin: "center" }}
        fill="none"
        opacity=".2"
        stroke={color}
        strokeWidth="15"
        strokeLinecap="round"
        cx="100"
        cy="100"
        r="70"
      ></circle>
    </svg>
  );
};

export default Loader;
