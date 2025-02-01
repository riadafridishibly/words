import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

import { InfoIcon } from "lucide-react";

interface DetailModalProps {
  word: string;
  definitions: {
    partOfSpeech: string;
    definitions: string[];
  }[];
  synonyms: string[];
  examples: string[];
}

export default function DetailModal({
  word,
  definitions,
  synonyms,
  examples,
}: DetailModalProps) {
  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        <Button variant="outline" size="sm">
          <InfoIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <ScrollArea className="max-h-[625px]">
          <DialogHeader>
            <DialogTitle>{word}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Definitions:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {definitions.map((def, index) => (
                <li key={index}>
                  <span className="font-thin italic mr-2">
                    {def.partOfSpeech}
                  </span>
                  <span>{def.definitions.join("; ")}</span>
                </li>
              ))}
            </ul>
          </div>
          {examples.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Examples:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {examples.map((exam, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: not gonna change
                  <li key={index}>{exam}</li>
                ))}
              </ul>
            </div>
          )}
          {synonyms.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Synonyms:</h3>
              <p>{synonyms.join(", ")}</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
