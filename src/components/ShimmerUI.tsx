import React from "react";
import "@/assets/styles/ShimmerUI.css";

export const ShimmerBar: React.FC = () => {
  return <div className="shimmer-bar"></div>;
};

export const ShimmerGrid: React.FC = () => {
  return (
    <div className="shimmer-grid">
      <div className="shimmer-grid-box"></div>
      <div className="shimmer-grid-box"></div>
      <div className="shimmer-grid-box"></div>
      <div className="shimmer-grid-box"></div>
      <div className="shimmer-grid-box"></div>
      <div className="shimmer-grid-box"></div>
    </div>
  );
};
