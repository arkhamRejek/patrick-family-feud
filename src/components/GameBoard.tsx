"use client";

import React from "react";
import { useGameContext, Question, Answer } from "../context/GameContext";

type GameBoardProps = {
  isAdmin?: boolean;
};

const GameBoard: React.FC<GameBoardProps> = ({ isAdmin = false }) => {
  const { activeQuestion, wrongAnswers, revealAnswer } = useGameContext();

  if (!activeQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-blue-900 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold text-amber-400">
          {isAdmin ? "Select a question to start" : "Waiting for question..."}
        </h2>
      </div>
    );
  }

  const renderXs = () => {
    return (
      <div className="flex justify-center my-4 gap-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`text-5xl font-bold ${
              index < wrongAnswers ? "text-red-600" : "text-gray-700"
            }`}
          >
            X
          </div>
        ))}
      </div>
    );
  };

  const renderAnswers = () => {
    const displayAnswers: (Answer | null)[] = [...Array(5)].map(
      (_, i) => activeQuestion.answers[i] || null
    );

    return (
      <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mt-6">
        {displayAnswers.map((answer, index) => {
          if (!answer)
            return (
              <div
                key={`empty-${index}`}
                className="h-16 bg-blue-800 rounded-md border border-amber-500"
              ></div>
            );

          const showAnswer =
            answer.revealed || (isAdmin && activeQuestion.answers[index]);

          return (
            <div
              key={index}
              onClick={() => isAdmin && revealAnswer(index)}
              className={`
                flex justify-between items-center 
                h-16 px-4 rounded-md border border-amber-500
                ${showAnswer ? "bg-blue-700" : "bg-blue-800"} 
                ${
                  isAdmin && !answer.revealed
                    ? "cursor-pointer hover:bg-blue-600"
                    : ""
                }
              `}
            >
              <div className="font-bold text-lg">
                {showAnswer ? (
                  <span>{answer.answer}</span>
                ) : (
                  <span className="opacity-0">Hidden</span>
                )}
              </div>
              <div className="bg-amber-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
                {showAnswer ? answer.points : ""}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center bg-blue-900 rounded-xl p-8 text-white w-full">
      <div className="bg-black text-amber-400 font-bold text-xl px-6 py-3 rounded-full mb-6 min-w-80 text-center">
        {activeQuestion.question}
      </div>

      {renderXs()}

      {renderAnswers()}
    </div>
  );
};

export default GameBoard;
