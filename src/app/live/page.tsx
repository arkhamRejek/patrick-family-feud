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
          // We need to set the wrong answer count directly
          // The addWrongAnswer function adds 1, but we need to set the exact count
          for (let i = 0; i < message.count; i++) {
            addWrongAnswer();
          }
          // Play buzzer sound for wrong answer
          playSound("buzzer");
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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-400">Family Feud</h1>
        <div className="flex gap-4">
          <div className="text-sm bg-blue-800 px-2 py-1 rounded">
            {displayQuestion ? "Connected" : "Waiting for question..."}
          </div>
          <Link href="/" className="text-gray-300 hover:text-white">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center">
        {!displayQuestion ? (
          <div className="flex flex-col items-center justify-center bg-blue-800 p-8 rounded-xl text-white shadow-lg">
            <h2 className="text-4xl font-bold text-amber-400 mb-4">
              Welcome to Family Feud!
            </h2>
            <p className="text-xl">Waiting for the game to start...</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <GameBoard />
          </div>
        )}
      </div>
    </div>
  );
}
