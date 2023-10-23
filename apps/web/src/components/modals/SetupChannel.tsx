import getChannels from "@/hooks/react-query/get-channels";
import setup from "@/hooks/react-query/setup-counter";
import { encrypt } from "@/utils/crypto";
import { AlertTriangle, Hash, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function SetupChannel() {
  const { data, isLoading } = getChannels();
  const [channelId, setChannelId] = useState<string>("");

  const { mutate, isLoading: isCreating, isSuccess } = setup();

  const handleSetup = () => {
    if (channelId === "") return toast.error("Please select a channel!");

    mutate({ channelId: encrypt(channelId) });
  };

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Setup</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setup</DialogTitle>
          <DialogDescription>
            Please a select the channel you'd like to set as your counting
            channel
          </DialogDescription>
        </DialogHeader>
        <div className="my-5">
          <Select onValueChange={setChannelId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a channel" />
            </SelectTrigger>
            <SelectContent className="h-96" side="bottom">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {data?.map((channel) => (
                    <SelectItem value={channel.id} key={channel.id}>
                      <div className="flex items-center gap-2">
                        {channel.nsfw ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <Hash className="w-4 h-4" />
                        )}
                        <span>{channel.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button isLoading={isCreating} onClick={handleSetup}>
            Setup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
