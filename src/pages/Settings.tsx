import { User, Bell, Shield, Palette, Database } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const settingsSections = [
  {
    id: "profile",
    title: "Profile",
    icon: User,
    settings: [
      { id: "name", label: "Display Name", type: "text", value: "User" },
      { id: "email", label: "Email", type: "text", value: "user@example.com" },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    settings: [
      { id: "daily-reminder", label: "Daily Reflection Reminder", type: "toggle", value: true },
      { id: "workout-reminder", label: "Workout Reminder", type: "toggle", value: true },
      { id: "expense-reminder", label: "Expense Logging Reminder", type: "toggle", value: false },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: Shield,
    settings: [
      { id: "data-local", label: "Store Data Locally Only", type: "toggle", value: true },
      { id: "analytics", label: "Anonymous Usage Analytics", type: "toggle", value: false },
    ],
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: Palette,
    settings: [
      { id: "compact", label: "Compact Mode", type: "toggle", value: false },
      { id: "animations", label: "Enable Animations", type: "toggle", value: true },
    ],
  },
  {
    id: "data",
    title: "Data Management",
    icon: Database,
    settings: [],
  },
];

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl animate-fade-in">
        <PageHeader
          title="Settings ⚙️"
          description="Customize your LifeTrack experience"
        />

        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className="rounded-xl border border-border bg-card animate-slide-up overflow-hidden"
              style={{ animationDelay: `${sectionIndex * 50}ms` }}
            >
              <div className="flex items-center gap-3 border-b border-border p-4">
                <section.icon className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">{section.title}</h3>
              </div>
              <div className="p-4">
                {section.settings.length > 0 ? (
                  <div className="space-y-4">
                    {section.settings.map((setting) => (
                      <div
                        key={setting.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{setting.label}</span>
                        {setting.type === "toggle" ? (
                          <Switch defaultChecked={setting.value as boolean} />
                        ) : (
                          <input
                            type="text"
                            defaultValue={setting.value as string}
                            className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Manage your stored data and preferences.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">
                        Clear All Data
                      </Button>
                      <Button variant="outline" size="sm">
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Version Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>LifeTrack v1.0.0</p>
          <p className="mt-1">Built with ❤️ for personal growth</p>
        </div>
      </div>
    </MainLayout>
  );
}
