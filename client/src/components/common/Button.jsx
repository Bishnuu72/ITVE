import React from "react";

function Button({ 
  text, 
  onClick, 
  type = "button", 
  className = "", 
  disabled = false 
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-md font-medium transition-colors
        ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}
        ${className}
      `}
    >
      {text}
    </button>
  );
}

export default Button;
