import { useConfigStore } from "@/states/config";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";

interface Props {
  value?: boolean;
}

export default function BanOnError({ value }: Props) {
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

      delete data?.banOnError;
      setData({ ...obj });
    } else {
      setData({
        ...data,
        banOnError: e,
      });
    }
  };

  return (
    <div className="flex items-center justify-between border rounded-md p-4">
      <div>
        <h3 className="font-medium">Ban On Error</h3>
        <p className="text-muted-foreground text-sm">
          You can ban the user from typing in the chat again if they break the
          streak
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
