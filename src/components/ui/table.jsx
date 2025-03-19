import React from "react";

export function Table({ children }) {
  return (
      <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              {children}
          </table>
      </div>
  );
}
