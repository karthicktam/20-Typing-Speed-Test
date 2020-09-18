import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [typingState, setState] = useState({
    text: "",
    inputValue: "",
    lastLetter: "",
    words: [],
    completedWords: [],
    completed: false,
    startTime: null,
    timeElapsed: "",
    wpm: 0,
    started: false,
    progress: 0
  });

  const setText = () => {
    const texts = [
      `You never read a book on psychology, Tippy. You didn't need to. You knew by some divine instinct that you can make more friends in two months by becoming genuinely interested in other people than you can in two years by trying to get other people interested in you.`,
      `I know more about the private lives of celebrities than I do about any governmental policy that will actually affect me. I'm interested in things that are none of my business, and I'm bored by things that are important to know.`,
      `A spider's body consists of two main parts: an anterior portion, the prosoma (or cephalothorax), and a posterior part, the opisthosoma (or abdomen).`,
      `As customers of all races, nationalities, and cultures visit the Dekalb Farmers Market by the thousands, I doubt that many stand in awe and contemplate the meaning of its existence. But in the capital of the Sunbelt South, the quiet revolution of immigration and food continues to upset and redefine the meanings of local, regional, and global identity.`,
      `Outside of two men on a train platform there's nothing in sight. They're waiting for spring to come, smoking down the track. The world could come to an end tonight, but that's alright. She could still be there sleeping when I get back.`,
      `I'm a broke-nose fighter. I'm a loose-lipped liar. Searching for the edge of darkness. But all I get is just tired. I went looking for attention. In all the wrong places. I was needing a redemption. And all I got was just cages.`
    ];

    const text = texts[Math.floor(Math.random() * texts.length)];
    const words = text.split(" ");

    setState((state) => ({
      ...state,
      text: text,
      words: words,
      completedWords: []
    }));
  };

  const startGame = () => {
    setText();

    setState((state) => ({
      ...state,
      started: true,
      startTime: Date.now(),
      completed: false,
      progress: 0,
      timeElapsed: 0,
      wpm: 0
    }));
  };

  const calculateWPM = () => {
    const { startTime, completedWords } = typingState;

    const now = Date.now();
    const diff = (now - startTime) / 1000 / 60; // 1000 ms / 60 s

    // every word is considered to have 5 letters
    // so here we are getting all the letters in the words and divide them by 5
    // "my" shouldn't be counted as same as "deinstitutionalization"
    const wordsTyped = Math.ceil(
      completedWords.reduce((acc, word) => (acc += word.length), 0) / 5
    );

    // calculating the wpm
    const wpm = Math.ceil(wordsTyped / diff);

    setState((state) => ({ ...state, wpm: wpm, timeElapsed: diff }));
  };

  const handleChange = (e) => {
    const { words, completedWords } = typingState;
    const inputValue = e.target.value;
    const lastLetter = inputValue[inputValue.length - 1];

    const currentWord = words[0];

    // if space or '.', check the word
    if (lastLetter === " " || lastLetter === ".") {
      // check to see if it matches to the currentWord
      // trim because it has the space
      if (inputValue.trim() === currentWord) {
        // remove the word from the wordsArray
        // cleanUp the input
        const newWords = [...words.slice(1)];
        const newCompletedWords = [...completedWords, currentWord];

        // Get the total progress by checking how much words are left
        const progress =
          (newCompletedWords.length /
            (newWords.length + newCompletedWords.length)) *
          100;

        setState((state) => ({
          ...state,
          words: newWords,
          completedWords: newCompletedWords,
          inputValue: "",
          completed: newWords.length === 0,
          progress: progress
        }));
      }
    } else {
      setState((state) => ({
        ...state,
        inputValue: inputValue,
        lastLetter: lastLetter
      }));
    }

    calculateWPM();
  };

  const {
    text,
    inputValue,
    completedWords,
    wpm,
    timeElapsed,
    started,
    completed,
    progress
  } = typingState;

  if (!started) {
    return (
      <div className="container">
        <h2>Welcome to the typing game</h2>
        <p>
          <strong>Rules:</strong> <br /> Type in the input field the highlighted
          word. <br /> The correct words turn{" "}
          <span className="green">Green</span>.<br /> Incorrect letters will
          turn <span className="red">Red</span>.<br />
          <br />
          Have Fun!{" "}
          <span role="img" aria-label="">
            😃
          </span>
        </p>
        <button className="start-btn" onClick={startGame}>
          Start Game
        </button>
      </div>
    );
  }

  if (!text) return <p>Loading...</p>;

  if (completed) {
    return (
      <div className="container">
        <h2>
          Your WPM is <strong>{wpm}</strong>
        </h2>
        <button className="start-btn" onClick={startGame}>
          Play Again
        </button>
        <p>or</p>
        <p>
          Share your score on{" "}
          <a
            href={`https://twitter.com/intent/tweet?text=My Typing Speed is ${wpm}. Let's see how fast you are! 😃 created by @karthicktamil17 https://lulj3.csb.app/`}
            target="_blank"
            rel="noopener noreferrer"
            className="share"
          >
            Twitter
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="wpm">
        <strong>WPM: </strong>
        {wpm}
        <br />
        <strong>Time: </strong>
        {Math.floor(timeElapsed * 60)}s
      </div>

      <div className="container">
        <h4>Type the text below</h4>
        <progress value={progress} max="100"></progress>
        <p className="text">
          {text.split(" ").map((word, w_idx) => {
            let hightlight = false;
            let currentWord = false;

            // this means that the word is completed, so turn it green
            if (completedWords.length > w_idx) {
              hightlight = true;
            }

            if (completedWords.length === w_idx) {
              currentWord = true;
            }

            return (
              <span
                className={`word ${hightlight && "green"} ${
                  currentWord && "underline"
                }`}
                key={w_idx}
              >
                {word.split("").map((letter, l_idx) => {
                  const isCurrentWord = completedWords.length === w_idx;
                  const isWronglyTyped = letter !== inputValue[l_idx];
                  const shouldBeHighlighted = l_idx < inputValue.length;

                  return (
                    <span
                      className={`letter ${
                        isCurrentWord && shouldBeHighlighted
                          ? isWronglyTyped
                            ? "red"
                            : "green"
                          : ""
                      }`}
                      key={l_idx}
                    >
                      {letter}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </p>
        <input
          type="text"
          onChange={handleChange}
          value={inputValue}
          autoFocus={started ? true : false}
        />
      </div>
    </div>
  );
}
