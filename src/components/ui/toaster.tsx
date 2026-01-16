import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "border border-neutral-200 bg-white text-neutral-900",
      }}
    />
  );
}
