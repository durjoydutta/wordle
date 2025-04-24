import { useEffect, useState } from "react";
import Row from "./components/Row";

const API_URL =
  "https://random-word-api.vercel.app/api?words=10&length=5&type=uppercase";
const GUESS_COUNT = 6;

const fetchRandomWord = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } catch (err) {
    console.error("ERROR FETCHING WORDS: ", err.message);
    return "REACT"; // Fallback word
  }
};

function App() {
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState(
    new Array(GUESS_COUNT).fill(" ".repeat(5))
  );
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    async function getWord() {
      const randomWord = await fetchRandomWord();
      setWord(randomWord);
      // console.log("Secret word:", randomWord); // For debugging
    }
    getWord();
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (gameOver) return;

      const key = event.key.toUpperCase(); // converting the letter to uppercase as the fetched word will be uppercase

      if (key === "ENTER" && currentGuess.length === 5) {
        submitGuess();
      } else if (key === "BACKSPACE" && currentGuess.length > 0) {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    }

    const submitGuess = () => {
      // Create a new guesses array with the current guess in the current row
      const newGuesses = [...guesses];
      newGuesses[currentRow] = currentGuess;
      setGuesses(newGuesses);

      // Check if the guess is correct
      if (currentGuess === word) {
        setGameWon(true);
        setGameOver(true);
        alert("Congratulations! You won!");
      } else if (currentRow === GUESS_COUNT - 1) {
        setGameOver(true);
        alert(`Game over! The word was: ${word}`);
      } else {
        setCurrentRow(currentRow + 1);
        setCurrentGuess("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, currentRow, gameOver, guesses, word]);

  // Display the current guess in the active row
  const displayGuesses = guesses.map((guess, index) => {
    if (index === currentRow) {
      return currentGuess.padEnd(5, " ");
    }
    return guess;
  });

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">DDC's Wordle</h1>
        <div className="flex-col">
          {displayGuesses.map((guess, index) => (
            <Row
              key={index}
              guess={guess}
              isSubmitted={
                index < currentRow || (index === currentRow && gameOver)
              }
              targetWord={index < currentRow || gameOver ? word : null}
            />
          ))}
        </div>
        {gameOver && (
          <button
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}>
            Play Again
          </button>
        )}
        <div className="mb-4 text-center">
          <p className="mb-2">Guess the 5-letter word in 6 attempts!</p>
          {gameOver && (
            <p className={gameWon ? "text-green-500" : "text-red-500"}>
              {gameWon ? "You won! 🎉" : `Game over! The word was: ${word}`}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
