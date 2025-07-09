"use client";

import React, { useState } from "react";
import GameBoard from "../../components/GameBoard";
import { useGameContext, Question } from "../../context/GameContext";
import Link from "next/link";
import { usePubNub } from "pubnub-react";

export default function AdminPage() {
  const {
    allQuestions,
    activeQuestion,
    setActiveQuestion,
    addWrongAnswer,
    resetWrongAnswers,
    endRound,
  } = useGameContext();
  const pubnub = usePubNub();

  const [showQuestionSelector, setShowQuestionSelector] =
    useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  // Function to manually publish a test message
  const testPubNub = () => {
    console.log("Testing PubNub connection...");
    pubnub
      .publish({
        channel: "family-feud",
        message: {
          type: "TEST",
          content: "Test message from admin",
        },
      })
      .then((response) => {
        console.log("PubNub test publish successful:", response);
      })
      .catch((error) => {
        console.error("PubNub test publish failed:", error);
      });
  };

  // Override the setActiveQuestion function to add debugging and direct publishing
  const handleSetActiveQuestion = (question: Question) => {
    console.log("Admin setting active question:", question);

    // First set the selected question state locally
    setSelectedQuestion(question);

    // Use context method
    setActiveQuestion(question);

    // Also publish directly to ensure the message gets sent
    const questionWithHiddenAnswers = {
      ...question,
      answers: question.answers.map((answer) => ({
        ...answer,
        revealed: false,
      })),
    };

    console.log("Admin directly publishing SET_QUESTION to PubNub");
    pubnub
      .publish({
        channel: "family-feud",
        message: {
          type: "SET_QUESTION",
          question: questionWithHiddenAnswers,
        },
      })
      .then((response) => {
        console.log("Admin direct publish successful:", response);
      })
      .catch((error) => {
        console.error("Admin direct publish failed:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-400">
          Patrick's Family Feud Admin
        </h1>
        <div className="flex gap-4">
          <button
            onClick={testPubNub}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Test PubNub
          </button>
          <Link href="/" className="text-gray-300 hover:text-white">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Question selector */}
        <div className="lg:col-span-1">
          <div className="bg-blue-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Questions</h2>
              <button
                onClick={() => setShowQuestionSelector(!showQuestionSelector)}
                className="bg-amber-500 text-black px-3 py-1 rounded"
              >
                {showQuestionSelector ? "Hide" : "Show"}
              </button>
            </div>

            {showQuestionSelector && (
              <div className="max-h-[60vh] overflow-y-auto space-y-3">
                {allQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => handleSetActiveQuestion(question)}
                    className={`
                      w-full text-left p-3 rounded 
                      ${
                        activeQuestion?.id === question.id ||
                        selectedQuestion?.id === question.id
                          ? "bg-amber-500 text-black"
                          : "bg-gray-700 hover:bg-gray-600"
                      }
                    `}
                  >
                    {question.question}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center - Game board */}
        <div className="lg:col-span-2">
          <GameBoard isAdmin={true} />

          {/* Controls */}
          {activeQuestion && (
            <div className="bg-blue-800 p-4 rounded-lg mt-6">
              <h2 className="text-xl font-bold mb-4">Game Controls</h2>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => addWrongAnswer()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Add X
                </button>

                <button
                  onClick={() => resetWrongAnswers()}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Reset X's
                </button>

                <button
                  onClick={() => endRound()}
                  className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded"
                >
                  End Round
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
