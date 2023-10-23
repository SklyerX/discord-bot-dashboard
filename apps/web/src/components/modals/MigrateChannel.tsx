import getChannels from "@/hooks/react-query/get-channels";
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
import { AlertTriangle, Hash, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import migrateChannel from "@/hooks/react-query/migrate-channel";
import { encrypt } from "@/utils/crypto";
import { toast } from "sonner";

interface Props {
  id: string;
}

export default function MigrateChannel({ id }: Props) {
  const { data, isLoading } = getChannels();
  const { mutate, isLoading: isMigrating, isSuccess } = migrateChannel();

  const [channelId, setChannelId] = useState<string>("");

  const handleMigration = () => {
    if (channelId === "") return toast.error("Please select a channel!");

    const encryptedChannelId = encrypt(channelId);

    mutate({ channelId: encryptedChannelId });
  };

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Migrate</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Migrate Channel</DialogTitle>
          <DialogDescription>
            Migrate your counting channel to another channel in your server
          </DialogDescription>
        </DialogHeader>
        <div>
          <span className="text-sm">Channels</span>
          <Select onValueChange={setChannelId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a channel" />
            </SelectTrigger>
            <SelectContent className="h-96" side="bottom">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {data
                    ?.filter((channel) => channel.id !== id)
                    .map((channel) => (
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
          <Button isLoading={isMigrating} onClick={handleMigration}>
            Setup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
