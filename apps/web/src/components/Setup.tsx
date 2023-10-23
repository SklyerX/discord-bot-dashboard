import SetupChannel from "./modals/SetupChannel";

export default function Setup() {
  return (
    <div>
      <h3 className="text-xl font-medium">Hey there!</h3>
      <p className="text-muted-foreground text-sm">
        It seems like you haven't setup a counting channel for your server. You
        can get started from here in the dashboard or you can use{" "}
        <span className="border rounded-md p-0.5 px-1">/setup</span> in discord.
      </p>
      <div className="w-full flex items-center mt-20 rounded-md justify-center">
        <SetupChannel />
      </div>
    </div>
  );
}
