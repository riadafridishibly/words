"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { VolumeIcon as VolumeUp, Check, X, Volume2 } from "lucide-react";
import DetailModal from "./Details";

interface FlashcardProps {
  word: string;
  definitions: {
    partOfSpeech: string;
    definitions: string[];
  }[];
  examples: string[];
  synonyms: string[];
}

export default function Flashcard({
  word,
  definitions,
  examples,
  synonyms,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [status, setStatus] = useState<"unknown" | "known" | null>(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
  };

  const handleStatus =
    (newStatus: "unknown" | "known") => (e: React.MouseEvent) => {
      e.stopPropagation();
      if (newStatus === status) {
        setStatus(null);
        return;
      }
      setStatus(newStatus);
    };

  return (
    <div className="perspective-1000 w-full h-64">
      <Card
        className={`w-full h-full  transition-transform duration-500 cursor-pointer ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }
        ${status === "unknown" ? "bg-red-300" : ""}
        ${status === "known" ? "bg-green-300" : ""}
        `}
        style={{ transformStyle: "preserve-3d" }}
        onClick={handleFlip}
      >
        <CardContent className="w-full backface-hidden">
          <div className="p-6 flex flex-col justify-between h-full">
            <h2 className="text-2xl font-bold text-center">{word}</h2>
            <div className="w-full h-full backface-hidden [transform:rotateY(180deg)]">
              <div className="p-4 flex items-center justify-center h-full">
                <p className="text-lg text-center">
                  {definitions?.at(0)?.definitions[0]}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className={"absolute w-full bottom-0"}>
          <div className="w-full flex flex-col items-center">
            <div className="flex justify-between gap-2">
              <DetailModal
                word={word}
                definitions={definitions}
                synonyms={synonyms}
                examples={examples}
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
      </Card>
    </div>
  );
}
