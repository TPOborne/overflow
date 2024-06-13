import { useState, useEffect, useRef } from 'react'
import './App.css'
import { getRandomNoun } from './nouns';

let randomColors = [
  "#12264d",
  "#18336c",
  "#1a3a90",
  "#3d5893",
  "#2c77d8"
];

console.log(randomColors);


function App() {
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const inputRef = useRef(null);
  const interval = 1200;

  const handleStart = () => {
    setWords([]);
    setScore(0);
    setInput('');
    setStarted(true);
  }

  const handleInput = (e) => {
    const { value } = e.target;
    setInput(value);
  }

  const getRandomColor = () => {
    // Generate a random index
    let randomIndex = Math.floor(Math.random() * randomColors.length);
    // Return the color at that index
    return randomColors[randomIndex];
  }

  useEffect(() => {
    if (!input || !words) return;
    const foundWord = words.find((word) => word.name === input);
    if (!foundWord) return;
    setWords((prev) => prev.filter((word) => word !== foundWord));
    setInput('');
    setScore((prev) => prev + 1);
  }, [input, words])

  useEffect(() => {
    if (!started) return;
    inputRef.current.focus();
    const addWordInterval = setInterval(() => {
      setWords((prev) => {
        const newWords = [{ name: getRandomNoun(), color: getRandomColor() }, ...prev];
        if (newWords.length > 6) {
          clearInterval(addWordInterval);
          setStarted(false);
        }
        return newWords;
      });
    }, interval);

    return () => clearInterval(addWordInterval);
  }, [started]);


  return (
    <>
      <h1>{score}</h1>
      <ul>
        {words.map((word, index) => <li key={index} style={{ background: word.color }}>{word.name}</li>)}
      </ul>
      {started ? (
        <input type="text" value={input} onChange={handleInput} ref={inputRef} />
      ) : (
        <button onClick={handleStart}>{!words.length ? 'Play' : 'Restart'}</button>
      )}
    </>
  )
}

export default App
