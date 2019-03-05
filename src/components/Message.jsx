import React from "react";

const Message = ({ type, message }) => {
  return (
    <div
      className={`alert ${type === "error" ? "alert-danger" : "alert-info"}`}
    >
      {message}
    </div>
  );
};

export default Message;
