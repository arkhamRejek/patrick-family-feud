"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePubNub } from "pubnub-react";
import questions from "../data.json";
import { playSound } from "../utils/sound";

export type Answer = {
  answer: string;
  points: number;
  revealed?: boolean;
};

export type Question = {
  id: number;
  question: string;
  answers: Answer[];
};

type GameContextType = {
  activeQuestion: Question | null;
  wrongAnswers: number;
  setActiveQuestion: (question: Question) => void;
  revealAnswer: (index: number) => void;
  addWrongAnswer: () => void;
  resetWrongAnswers: () => void;
  endRound: () => void;
  allQuestions: Question[];
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [activeQuestion, setActiveQuestionState] = useState<Question | null>(
    null
  );
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const [allQuestions] = useState<Question[]>(questions);
  const pubnub = usePubNub();

  const setActiveQuestion = (question: Question) => {
    console.log("GameContext: setActiveQuestion called with:", question);

    const questionWithHiddenAnswers = {
      ...question,
      answers: question.answers.map((answer) => ({
        ...answer,
        revealed: false,
      })),
    };

    setActiveQuestionState(questionWithHiddenAnswers);

    console.log("GameContext: Publishing SET_QUESTION event to PubNub");
    pubnub
      .publish({
        channel: "family-feud",
        message: {
          type: "SET_QUESTION",
          question: questionWithHiddenAnswers,
        },
      })
      .then((response) => {
        console.log("GameContext: SET_QUESTION publish successful:", response);
      })
      .catch((error) => {
        console.error(
          "GameContext: Failed to publish SET_QUESTION event:",
          error
        );
      });
  };

  const revealAnswer = (index: number) => {
    if (!activeQuestion) return;

    const updatedAnswers = [...activeQuestion.answers];
    updatedAnswers[index] = { ...updatedAnswers[index], revealed: true };

    const updatedQuestion = {
      ...activeQuestion,
      answers: updatedAnswers,
    };

    setActiveQuestionState(updatedQuestion);

    playSound("ding");

    pubnub.publish({
      channel: "family-feud",
      message: {
        type: "REVEAL_ANSWER",
        questionId: activeQuestion.id,
        answerIndex: index,
      },
    });
  };

  const addWrongAnswer = () => {
    if (wrongAnswers < 3) {
      // First play the buzzer sound
      playSound("buzzer");

      // Then delay the X appearance for a more dramatic effect
      setTimeout(() => {
        const newCount = wrongAnswers + 1;
        setWrongAnswers(newCount);

        // Publish to PubNub
        pubnub.publish({
          channel: "family-feud",
          message: {
            type: "WRONG_ANSWER",
            count: newCount,
          },
        });
      }, 300); // Delay for dramatic effect
    }
  };

  const resetWrongAnswers = () => {
    setWrongAnswers(0);

    pubnub.publish({
      channel: "family-feud",
      message: {
        type: "RESET_WRONG_ANSWERS",
      },
    });
  };

  const endRound = () => {
    setActiveQuestionState(null);
    setWrongAnswers(0);

    pubnub.publish({
      channel: "family-feud",
      message: {
        type: "END_ROUND",
      },
    });
  };

  useEffect(() => {
    console.log("GameContext: PubNub instance updated");

    pubnub.subscribe({
      channels: ["family-feud"],
    });

    return () => {
      pubnub.unsubscribe({
        channels: ["family-feud"],
      });
    };
  }, [pubnub]);

  const value = {
    activeQuestion,
    wrongAnswers,
    setActiveQuestion,
    revealAnswer,
    addWrongAnswer,
    resetWrongAnswers,
    endRound,
    allQuestions,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
