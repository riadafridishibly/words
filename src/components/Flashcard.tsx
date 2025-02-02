"use client";

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Check, X, Volume2 } from "lucide-react";
import DetailModal from "./Details";
import FlipCard from "./FlipCard";
import { getFlashcardStates, setFlashcardState } from "~/lib/localStorage";
import React from "react";

interface FlashcardProps {
  word: string;
  definitions: {
    partOfSpeech: string;
    definitions: string[];
  }[];
  examples: string[];
  synonyms: string[];
}

export default function Flashcard(props: FlashcardProps) {
  const [status, setStatus] = React.useState<"unknown" | "known" | null>(() => {
    const states = getFlashcardStates();
    if (states[props.word] === "k") return "known";
    if (states[props.word] === "u") return "unknown";
    return null;
  });

  React.useEffect(() => {
    const states = getFlashcardStates();
    if (states[props.word] === "k") setStatus("known");
    else if (states[props.word] === "u") setStatus("unknown");
  }, [props.word]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(props.word);
    window.speechSynthesis.speak(utterance);
  };

  const handleStatus =
    (newStatus: "unknown" | "known" | null) => (e: React.MouseEvent) => {
      e.stopPropagation();
      if (newStatus === status) {
        setStatus(null);
        setFlashcardState(props.word, null);
        return;
      }
      setStatus(newStatus);
      setFlashcardState(
        props.word,
        newStatus === "known" ? "k" : newStatus === "unknown" ? "u" : null
      );
    };

  const smallestDefs = props.definitions.map((v) => {
    return {
      ...v,
      definitions: v.definitions.at(0), // better to take the first one
    };
  });

  return (
    <div className="w-full h-64">
      <FlipCard
        front={
          <CardWrapper
            status={status}
            handleStatus={handleStatus}
            handleSpeak={handleSpeak}
            card={props}
          >
            <h2 className="text-2xl font-bold text-center">{props.word}</h2>
          </CardWrapper>
        }
        back={
          <CardWrapper
            status={status}
            handleStatus={handleStatus}
            handleSpeak={handleSpeak}
            card={props}
            hideFooter={true}
          >
            <p className="text-lg text-center">
              {smallestDefs?.at(0)?.definitions}
            </p>
          </CardWrapper>
        }
      />
    </div>
  );
}

function CardWrapper({
  status,
  handleStatus,
  children,
  card,
  handleSpeak,
  hideFooter,
}: {
  status: "unknown" | "known" | null;
  handleStatus: (
    status: "unknown" | "known" | null
  ) => (e: React.MouseEvent) => void;
  handleSpeak: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  card: FlashcardProps;
  hideFooter?: boolean;
}) {
  return (
    <Card
      className={`absolute  w-full h-full  transition-transform duration-500 cursor-pointer 
        ${status === "unknown" ? "bg-red-300" : ""}
        ${status === "known" ? "bg-green-300" : ""}`}
    >
      <CardContent className={"w-full h-full"}>
        <div className="p-6 flex flex-col justify-between w-full h-full">
          <div className="w-full h-full backface-hidden">
            <div className="p-4 flex items-center justify-center h-full">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
      {!hideFooter && (
        <CardFooter className={"absolute w-full bottom-0"}>
          <div className="w-full flex flex-col items-center">
            <div className="flex justify-between gap-2">
              <DetailModal
                word={card.word}
                definitions={card.definitions}
                synonyms={card.synonyms}
                examples={card.examples}
              />
              <Button variant="outline" size="sm" onClick={handleSpeak}>
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button
                variant={status === "unknown" ? "destructive" : "outline"}
                size="sm"
                onClick={handleStatus("unknown")}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant={status === "known" ? "default" : "outline"}
                size="sm"
                onClick={handleStatus("known")}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
