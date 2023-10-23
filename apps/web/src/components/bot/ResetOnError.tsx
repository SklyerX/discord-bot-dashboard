import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { useConfigStore } from "@/states/config";

interface Props {
  value?: boolean;
}

export default function ResetOnError({ value }: Props) {
  const [checked, setChecked] = useState<boolean | undefined>(value);
  const { data, setData, resetted } = useConfigStore();

  useEffect(() => {
    if (resetted) {
      setChecked(value);
    }
  }, [resetted]);

  const onChange = (e: boolean) => {
    setChecked(e);
    if (e === value) {
      let obj = data;

      delete data?.resetOnError;
      setData({ ...obj });
    } else {
      setData({
        ...data,
        resetOnError: e,
      });
    }
  };

  return (
    <div className="flex items-center justify-between border rounded-md p-4">
      <div>
        <h3 className="font-medium">Reset on Error</h3>
        <p className="text-muted-foreground text-sm">
          Reset the current streak and start at 0 if a user breaks the chain
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
