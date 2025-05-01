import React from 'react';

export default function LoadingModal({ progress = 0, message = 'Uploading...', visible = false }) {
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-80 text-center">
        <h2 className="mb-4 font-semibold">{message}</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">{progress}%</p>
      </div>
    </div>
  );
}
