"use client";

import React, { useEffect, useState } from "react";
import GameBoard from "../../components/GameBoard";
import { useGameContext, Question } from "../../context/GameContext";
import { usePubNub } from "pubnub-react";
import Link from "next/link";
import { playSound } from "../../utils/sound";

// Define types for PubNub messages
type PubNubMessage = {
  type:
    | "SET_QUESTION"
    | "REVEAL_ANSWER"
    | "WRONG_ANSWER"
    | "RESET_WRONG_ANSWERS"
    | "END_ROUND";
  question?: Question;
  questionId?: number;
  answerIndex?: number;
  count?: number;
};

export default function LivePage() {
  const {
    activeQuestion,
    setActiveQuestion,
    revealAnswer,
    addWrongAnswer,
    resetWrongAnswers,
    endRound,
  } = useGameContext();
  const pubnub = usePubNub();

  // Local state for tracking the question
  const [localActiveQuestion, setLocalActiveQuestion] =
    useState<Question | null>(null);

  useEffect(() => {
    console.log("Live board subscribing to PubNub...");

    // Listen for messages on the family-feud channel
    const listener = {
      message: (event: any) => {
        console.log("Live board received message:", event.message);
        const message = event.message as PubNubMessage;

        if (message.type === "SET_QUESTION" && message.question) {
          console.log("Setting active question from PubNub:", message.question);
          // Update local state and game context
          setLocalActiveQuestion(message.question);
          setActiveQuestion(message.question);
        } else if (
          message.type === "REVEAL_ANSWER" &&
          typeof message.answerIndex === "number"
        ) {
          console.log("Revealing answer at index:", message.answerIndex);
          revealAnswer(message.answerIndex);
          // Play ding sound for correct answer
          playSound("ding");
        } else if (
          message.type === "WRONG_ANSWER" &&
          typeof message.count === "number"
        ) {
          console.log("Setting wrong answers to:", message.count);

          // Play buzzer sound for wrong answer first
          playSound("buzzer");

          // Reset current wrong answer count
          resetWrongAnswers();

          // Delay adding X's for dramatic effect
          setTimeout(() => {
            // Add exactly the number of X's needed
            for (let i = 0; i < message.count!; i++) {
              setTimeout(() => {
                addWrongAnswer();
              }, 100); // Small delay between multiple X's if needed
            }
          }, 300);
        } else if (message.type === "RESET_WRONG_ANSWERS") {
          console.log("Resetting wrong answers");
          resetWrongAnswers();
        } else if (message.type === "END_ROUND") {
          console.log("Ending round");
          setLocalActiveQuestion(null);
          endRound();
        }
      },
    };

    pubnub.addListener(listener);

    pubnub.subscribe({
      channels: ["family-feud"],
    });

    // Log subscription success
    console.log("Subscribed to family-feud channel");

    return () => {
      pubnub.removeListener(listener);
      pubnub.unsubscribe({
        channels: ["family-feud"],
      });
      console.log("Unsubscribed from family-feud channel");
    };
  }, [
    pubnub,
    setActiveQuestion,
    revealAnswer,
    addWrongAnswer,
    resetWrongAnswers,
    endRound,
  ]);

  // Use either the context's active question or our local state
  const displayQuestion = activeQuestion || localActiveQuestion;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
      <header className="flex justify-between items-center mb-8 px-4">
        <h1 className="text-3xl font-light tracking-tight text-white">
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Warr Family Feud
          </span>
        </h1>
        <div className="flex gap-4 items-center">
          <div
            className={`text-sm px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
              displayQuestion
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-slate-700/50 text-slate-300"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                displayQuestion
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-slate-400"
              }`}
            ></span>
            {displayQuestion ? "Live" : "Waiting"}
          </div>
          <Link
            href="/"
            className="text-slate-300 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center">
        {!displayQuestion ? (
          <div className="flex flex-col items-center justify-center bg-slate-800/60 backdrop-blur-sm p-12 rounded-2xl text-white shadow-lg border border-slate-700/50 max-w-lg w-full mx-auto mt-12">
            <div className="w-20 h-20 mb-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-light text-white mb-4">
              Waiting for questions
            </h2>
            <p className="text-slate-400 text-center">
              The host will start the quiz shortly. Get ready!
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto">
            <GameBoard />
          </div>
        )}
      </div>
    </div>
  );
}
