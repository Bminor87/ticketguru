import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="relative bg-white w-11/12 h-5/6 rounded-lg shadow-lg">
        {/* The close button container */}
        <div className="absolute top-4 right-4">
          <button
            className="text-gray-800 text-3xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {/* Scrollable content */}
        <div className="p-8 h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
