import React from "react";

const Group = ({ label, children }) => {
  return (
    <div
      style={{
        fontWeight: "400",
        fontSize: "0.9rem",
      }}
    >
      {label ? (
        <div
          style={{
            paddingBottom: "8px",
            userSelect: "none",
          }}
        >
          {label}
        </div>
      ) : (
        <span />
      )}
      <div
        style={{
          display: "block",
          marginBottom: "12px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Group;
