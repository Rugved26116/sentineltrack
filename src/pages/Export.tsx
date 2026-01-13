import { Download, FileJson, FileSpreadsheet, Check } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const exportOptions = [
  {
    id: "workouts",
    title: "Workouts",
    description: "All workout logs with exercises, sets, reps, and weights",
    icon: "💪",
  },
  {
    id: "expenses",
    title: "Expenses",
    description: "Complete expense history with categories and amounts",
    icon: "💰",
  },
  {
    id: "academic",
    title: "Academic History",
    description: "Study sessions, subjects, and progress data",
    icon: "📚",
  },
  {
    id: "reflections",
    title: "Reflections",
    description: "All daily reflections and mood entries",
    icon: "🪞",
  },
  {
    id: "all",
    title: "Everything",
    description: "Complete data export from all domains",
    icon: "📦",
  },
];

export default function ExportPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl animate-fade-in">
        <PageHeader
          title="Export Data 📦"
          description="Your data belongs to you. Export it anytime."
        />

        {/* Export Format Selection */}
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Export Format
          </h3>
          <div className="flex gap-4">
            <button className="flex flex-1 items-center justify-center gap-3 rounded-xl border-2 border-primary bg-primary/10 p-4 transition-all">
              <FileJson className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="font-medium">JSON</p>
                <p className="text-xs text-muted-foreground">Structured data</p>
              </div>
              <Check className="ml-auto h-5 w-5 text-primary" />
            </button>
            <button className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-muted-foreground/30">
              <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">CSV</p>
                <p className="text-xs text-muted-foreground">Spreadsheet ready</p>
              </div>
            </button>
          </div>
        </div>

        {/* Data Selection */}
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Select Data to Export
          </h3>
          <div className="space-y-3">
            {exportOptions.map((option, index) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all animate-slide-up hover:border-muted-foreground/30"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-muted-foreground text-primary focus:ring-primary"
                />
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{option.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <Button size="lg" className="w-full">
          <Download className="mr-2 h-5 w-5" />
          Export Selected Data
        </Button>

        {/* Info */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Exports are generated locally and never stored on our servers.
          <br />
          Your privacy is our priority.
        </p>
      </div>
    </MainLayout>
  );
}
