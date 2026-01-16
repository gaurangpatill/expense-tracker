import { SettingsPanel } from "@/components/settings/settings-panel";
import { SignOutButton } from "@/components/layout/signout-button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-neutral-500">Manage security and account preferences.</p>
        </div>
        <SignOutButton />
      </div>
      <SettingsPanel />
    </div>
  );
}
