import React from "react";
import Tile from "./Tile";

function Row({ guess, isSubmitted, targetWord }) {
  return (
    <div className="flex gap-3 py-2">
      {guess.split("").map((char, index) => {
        let status = "empty";

        if (isSubmitted && targetWord) {
          if (char === targetWord[index]) {
            status = "correct";
          } else if (targetWord.includes(char)) {
            status = "present";
          } else if (char !== " ") {
            status = "absent";
          }
        }

        return <Tile key={index} char={char} status={status} />;
      })}
    </div>
  );
}

export default Row;
