import React from "react";

function Tile({ char, status }) {
  const getBackgroundColor = () => {
    switch (status) {
      case "correct":
        return "bg-green-500";
      case "present":
        return "bg-yellow-500";
      case "absent":
        return "bg-gray-500";
      default:
        return "bg-white dark:bg-gray-800";
    }
  };

  return (
    <div
      className={`flex justify-center items-center border border-gray-400 w-12 h-12 text-xl font-bold ${getBackgroundColor()} transition-colors`}>
      {char !== " " ? char : ""}
    </div>
  );
}

export default Tile;
