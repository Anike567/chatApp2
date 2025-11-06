import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render if not open

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-blue-50 bg-opacity-50 z-50">
      <div className="bg-white rounded-none shadow-lg w-full h-full relative">
        {/* Close Button */}
        <div id="header">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
            onClick={onClose}
          >
            ✖
          </button>
        </div>
        <div className="p-6 w-full h-full flex flex-col justify-center items-center overflow-auto bg-blue-50">
          {children}
        </div>

      </div>
    </div>,
    document.body
  );
};

export default Modal;
