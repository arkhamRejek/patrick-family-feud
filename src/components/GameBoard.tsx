"use client";

import React, { useState, useEffect } from "react";
import { useGameContext, Question, Answer } from "../context/GameContext";
import "../styles/flip-animation.css";

type GameBoardProps = {
  isAdmin?: boolean;
};

const GameBoard: React.FC<GameBoardProps> = ({ isAdmin = false }) => {
  const { activeQuestion, wrongAnswers, revealAnswer } = useGameContext();
  const [showBigX, setShowBigX] = useState(false);
  const [displayedXCount, setDisplayedXCount] = useState(0);

  // Effect to show the big X animation when wrongAnswers changes
  useEffect(() => {
    if (wrongAnswers > 0 && wrongAnswers !== displayedXCount) {
      setShowBigX(true);
      setDisplayedXCount(wrongAnswers);

      const timer = setTimeout(() => {
        setShowBigX(false);
      }, 1800); // Match animation duration

      return () => clearTimeout(timer);
    }
  }, [wrongAnswers, displayedXCount]);

  // Render empty state if no active question
  if (!activeQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 text-white border border-slate-700/50 shadow-lg">
        <h2 className="text-2xl font-light text-white">
          {isAdmin ? "Select a question to start" : "Welcome to the Quiz!"}
        </h2>
      </div>
    );
  }

  // Display X's for wrong answers
  const renderXs = () => {
    return (
      <div className="flex justify-center my-6 gap-10 relative min-h-[80px]">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`wrong-answer-modern ${
              index < wrongAnswers ? "visible" : "hidden"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ))}
      </div>
    );
  };

  // Render big modal X when a wrong answer is added
  const renderModalX = () => {
    if (!showBigX) return null;

    // Calculate size based on number of Xs
    const sizeClass =
      wrongAnswers > 1
        ? wrongAnswers === 2
          ? "modal-x-medium"
          : "modal-x-small"
        : "modal-x-large";

    return (
      <div
        className={`x-modal-container-modern ${
          wrongAnswers > 1 ? "multiple" : ""
        }`}
      >
        {[...Array(wrongAnswers)].map((_, idx) => (
          <div key={idx} className={`modal-x-modern ${sizeClass}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ))}
      </div>
    );
  };

  // Render answers in the board
  const renderAnswers = () => {
    // Ensure we always show up to 8 answers like the image
    const displayAnswers: (Answer | null)[] = [...Array(8)].map(
      (_, i) => activeQuestion.answers[i] || null
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mt-6">
        {displayAnswers.map((answer, index) => {
          if (!answer)
            return (
              <div
                key={`empty-${index}`}
                className="h-20 bg-slate-800/30 rounded-lg border border-slate-700/30"
              ></div>
            );

          const isRevealed = answer.revealed;

          return (
            <div
              key={index}
              onClick={() => isAdmin && !isRevealed && revealAnswer(index)}
              className={`
                flex h-20 rounded-lg border border-slate-700/50
                ${
                  isAdmin && !isRevealed
                    ? "cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/50"
                    : ""
                }
                flip-card ${isRevealed ? "flipped" : ""}
              `}
            >
              <div className="flip-card-inner">
                {/* Front side (hidden answer) */}
                <div className="flip-card-front bg-slate-800/60 backdrop-blur-sm flex items-center justify-center w-full h-full rounded-lg">
                  {isAdmin ? (
                    <div className="flex justify-between items-center w-full px-4">
                      <div className="font-medium text-lg text-white opacity-70">
                        {answer.answer}
                      </div>
                      <div className="bg-indigo-600/70 text-white font-medium rounded-md min-w-10 h-10 flex items-center justify-center px-3">
                        {answer.points}
                      </div>
                    </div>
                  ) : (
                    <span className="text-white font-medium text-xl opacity-0">
                      Hidden
                    </span>
                  )}
                </div>

                {/* Back side (revealed answer) */}
                <div className="flip-card-back bg-gradient-to-r from-indigo-600/80 to-indigo-800/80 backdrop-blur-sm flex justify-between items-center w-full h-full rounded-lg">
                  <div className="font-medium text-xl text-white pl-4 flex-1">
                    {answer.answer}
                  </div>
                  <div className="bg-indigo-500/80 text-white font-medium text-xl h-full flex items-center justify-center px-4 min-w-[60px]">
                    {answer.points}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Modal X overlay */}
      {renderModalX()}

      <div className="flex flex-col items-center bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 text-white w-full border border-slate-700/50 shadow-lg">
        {/* Question header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 font-medium text-xl px-8 py-4 rounded-lg mb-6 w-full max-w-2xl text-center shadow-md">
          {activeQuestion.question}
        </div>

        {/* Wrong answers */}
        {renderXs()}

        {/* Answer board */}
        {renderAnswers()}
      </div>
    </>
  );
};

export default GameBoard;
