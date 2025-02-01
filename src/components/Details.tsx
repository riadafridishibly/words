import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { InfoIcon } from "lucide-react";

interface DetailModalProps {
  word: string;
  definitions: string[];
  synonyms: string[];
}

export default function DetailModal({
  word,
  definitions,
  synonyms,
}: DetailModalProps) {
  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        <Button
          // onClick={(e) => e.stopPropagation()}
          variant="outline"
          size="sm"
        >
          <InfoIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{word}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Definitions:</h3>
          <ul className="list-disc pl-5 space-y-2">
            {definitions.map((def, index) => (
              <li key={index}>{def}</li>
            ))}
          </ul>
        </div>
        {synonyms.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Synonyms:</h3>
            <p>{synonyms.join(", ")}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
