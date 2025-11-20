import React from "react";

function Loader({ size = 8, color = "blue-600", text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`w-${size} h-${size} border-4 border-t-${color} border-gray-200 rounded-full animate-spin`}
      ></div>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

export default Loader;
