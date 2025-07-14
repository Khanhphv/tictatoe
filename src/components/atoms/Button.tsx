import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, disabled, ...props }) => (
  <button
    {...props}
    disabled={disabled}
    style={{
      padding: "0.5rem 1rem",
      fontSize: "1.25rem",
      border: "1px solid #ccc",
      borderRadius: "0.5rem",
      background: disabled ? "#f5f5f5" : "#fff",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: "all 0.2s ease",
      touchAction: "manipulation",
      userSelect: "none",
      minHeight: "44px", // Touch target size
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...props.style,
    }}
  >
    {children}
  </button>
);

export default Button;
