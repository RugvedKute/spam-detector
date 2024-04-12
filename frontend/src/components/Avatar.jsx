import React from "react";

export default function Avatar({ size }) {
  return (
    <div>
      <div className={`w-${size} h-${size} bg-gray-200 rounded-full`}></div>
    </div>
  );
}
