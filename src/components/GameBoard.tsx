"use client";

import React from "react";
import { useGameContext, Question, Answer } from "../context/GameContext";
import "../styles/flip-animation.css";

type GameBoardProps = {
  isAdmin?: boolean;
};

const GameBoard: React.FC<GameBoardProps> = ({ isAdmin = false }) => {
  const { activeQuestion, wrongAnswers, revealAnswer } = useGameContext();

  // Render empty state if no active question
  if (!activeQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-blue-900 rounded-xl p-8 text-white family-feud-board">
        <h2 className="text-3xl font-bold text-amber-400">
          {isAdmin ? "Select a question to start" : "Welcome to Family Feud!"}
        </h2>
      </div>
    );
  }

  // Display X's for wrong answers
  const renderXs = () => {
    return (
      <div className="flex justify-center my-6 gap-8">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`wrong-answer ${
              index < wrongAnswers ? "opacity-100" : "opacity-20"
            }`}
          >
            X
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
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl mt-6">
        {displayAnswers.map((answer, index) => {
          if (!answer)
            return (
              <div
                key={`empty-${index}`}
                className="h-20 bg-blue-800 rounded-md border-2 border-amber-500"
              ></div>
            );

          const isRevealed = answer.revealed;

          return (
            <div
              key={index}
              onClick={() => isAdmin && !isRevealed && revealAnswer(index)}
              className={`
                flex h-20 rounded-md border-2 border-amber-400
                ${
                  isAdmin && !isRevealed
                    ? "cursor-pointer hover:bg-blue-600"
                    : ""
                }
                flip-card ${isRevealed ? "flipped" : ""}
              `}
            >
              <div className="flip-card-inner">
                {/* Front side (hidden answer) */}
                <div className="flip-card-front bg-blue-700 flex items-center justify-center w-full h-full rounded-md">
                  {isAdmin ? (
                    <div className="flex justify-between items-center w-full px-4">
                      <div className="font-bold text-lg text-white opacity-70">
                        {answer.answer}
                      </div>
                      <div className="bg-blue-600 text-white font-bold rounded-md min-w-10 h-10 flex items-center justify-center px-3">
                        {answer.points}
                      </div>
                    </div>
                  ) : (
                    <span className="text-white font-bold text-xl opacity-0">
                      Hidden
                    </span>
                  )}
                </div>

                {/* Back side (revealed answer) */}
                <div className="flip-card-back bg-blue-700 flex justify-between items-center w-full h-full rounded-md">
                  <div className="font-bold text-xl text-white uppercase tracking-wide pl-4 flex-1">
                    {answer.answer}
                  </div>
                  <div className="bg-blue-500 text-white font-bold text-xl h-full flex items-center justify-center px-4 min-w-[60px]">
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
    <div className="flex flex-col items-center bg-blue-900 rounded-xl p-8 text-white w-full family-feud-board">
      {/* Question header */}
      <div className="bg-black text-amber-400 font-bold text-2xl px-8 py-4 rounded-full mb-6 min-w-96 text-center highlight-border">
        {activeQuestion.question}
      </div>

      {/* Wrong answers */}
      {renderXs()}

      {/* Answer board */}
      {renderAnswers()}
    </div>
  );
};

export default GameBoard;
