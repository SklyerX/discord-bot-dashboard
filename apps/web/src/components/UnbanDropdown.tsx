import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import unbanUser from "@/hooks/react-query/unban-user";
import { Check, Loader2, MoreVertical, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  userId: string;
  onChange: () => void;
}

export default function UnbanDropdown({ userId, onChange }: Props) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

  const { mutate, isLoading, isSuccess } = unbanUser();

  useEffect(() => {
    if (isSuccess) {
      onChange();
      setIsDeleteMode(false);
      setIsOpened(false);
    }
  }, [isSuccess]);

  return (
    <DropdownMenu
      open={isOpened}
      onOpenChange={(e) => {
        if (isLoading) return;
        setIsOpened(e);
      }}
    >
      <DropdownMenuTrigger>
        <MoreVertical className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="w-full"
          onSelect={(e) => e.preventDefault()}
        >
          {isDeleteMode ? (
            <div className="flex w-full items-center justify-between">
              <span>Sure?</span>
              <div className="flex">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <div
                      role="button"
                      onClick={() => mutate({ userId })}
                      className="p-0.5 rounded-md bg-red-500"
                    >
                      <Check className="w-4 h-4" />
                    </div>
                    <div
                      role="button"
                      className="p-0.5 rounded-md bg-input ml-1"
                      onClick={() => setIsDeleteMode(false)}
                    >
                      <X className="w-4 h-4" />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              <span
                role="button"
                onClick={() => setIsDeleteMode(true)}
                className="inline-flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
