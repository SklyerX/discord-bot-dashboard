import { useConfigStore } from "@/states/config";
import { Button } from "../ui/button";
import updateSettings from "@/hooks/react-query/update-settings";
import { useEffect } from "react";

export default function SaveChanges() {
  const { data, resetData, setResetted } = useConfigStore();
  const { mutate, isLoading, isSuccess } = updateSettings();

  const handleReset = () => {
    resetData();
    setResetted(true);
  };

  useEffect(() => {
    if (isSuccess) {
      resetData();
    }
  }, [isSuccess]);

  return (
    <div className="container fixed left-1/2 bottom-8 z-50 -translate-x-1/2 ">
      <div className="bg-background border h-14 rounded-md flex flex-grow items-center justify-between px-3">
        <p>Changes detected! Please save or cancel!</p>
        <div className="space-x-1">
          <Button variant="ghost" onClick={handleReset}>
            Cancel
          </Button>
          <Button isLoading={isLoading} onClick={() => mutate({ ...data })}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
