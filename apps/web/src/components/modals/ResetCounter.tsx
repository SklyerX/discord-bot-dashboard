import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import resetStreak from "@/hooks/react-query/reset-streak";
import { toast } from "sonner";

interface Props {
  currentCount: number;
}

export default function ResetCounter({ currentCount }: Props) {
  const [value, setValue] = useState<string>("");

  const { mutate, isLoading, isSuccess } = resetStreak();

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  const handleReset = () => {
    if (value !== `reset my streak of ${currentCount}`)
      return toast.error("Incorrect confirmation value");

    mutate();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Reset</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset streak</DialogTitle>
          <DialogDescription>
            Are you absolutely sure? This action cannot be undone and the
            current streak of <strong>{currentCount}</strong> will be set to{" "}
            <strong>0</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <span className="text-xs">
            Type <strong>reset my streak of {currentCount}</strong>:
          </span>
          <Input
            className="mt-1"
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            isLoading={isLoading}
            onClick={handleReset}
          >
            Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
