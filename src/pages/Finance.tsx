import { useState } from "react";
import { Plus, Wallet, TrendingUp, TrendingDown, Coffee, Car, ShoppingBag, Utensils, Home, Gamepad } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  icon: typeof Coffee;
}

const categoryIcons: Record<string, typeof Coffee> = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Entertainment: Gamepad,
  Housing: Home,
  Coffee: Coffee,
};

const mockExpenses: Expense[] = [
  { id: "1", category: "Food", description: "Lunch at cafe", amount: 350, date: "Today", icon: Utensils },
  { id: "2", category: "Transport", description: "Uber ride", amount: 180, date: "Today", icon: Car },
  { id: "3", category: "Coffee", description: "Starbucks", amount: 280, date: "Today", icon: Coffee },
  { id: "4", category: "Shopping", description: "Amazon order", amount: 1200, date: "Yesterday", icon: ShoppingBag },
  { id: "5", category: "Food", description: "Groceries", amount: 850, date: "Yesterday", icon: Utensils },
  { id: "6", category: "Entertainment", description: "Netflix", amount: 199, date: "3 days ago", icon: Gamepad },
];

const categoryBreakdown = [
  { category: "Food", amount: 2400, percentage: 40, color: "bg-finance" },
  { category: "Transport", amount: 1200, percentage: 20, color: "bg-health" },
  { category: "Shopping", amount: 1500, percentage: 25, color: "bg-academic" },
  { category: "Entertainment", amount: 900, percentage: 15, color: "bg-reflection" },
];

export default function FinancePage() {
  const [expenses] = useState(mockExpenses);

  const todayTotal = expenses
    .filter((e) => e.date === "Today")
    .reduce((sum, e) => sum + e.amount, 0);

  const weekTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl animate-fade-in">
        <PageHeader
          title="Personal Finance 💰"
          description="Track your spending and build financial discipline"
          actions={
            <Button className="bg-finance text-finance-foreground hover:bg-finance/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          }
        />

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">₹{todayTotal}</p>
              </div>
              <div className="flex items-center text-sm text-status-bad">
                <TrendingUp className="mr-1 h-4 w-4" />
                +12%
              </div>
            </div>
          </div>
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">₹{weekTotal}</p>
              </div>
              <div className="flex items-center text-sm text-status-good">
                <TrendingDown className="mr-1 h-4 w-4" />
                -8%
              </div>
            </div>
          </div>
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Budget</p>
                <p className="text-2xl font-bold">₹15,000</p>
              </div>
              <div className="text-sm text-muted-foreground">
                42% used
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Expense List */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-lg font-semibold">Recent Expenses</h3>
            <div className="space-y-3">
              {expenses.map((expense, index) => {
                const Icon = expense.icon;
                return (
                  <div
                    key={expense.id}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all animate-slide-up hover:border-finance/30"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="rounded-lg bg-finance-muted p-2">
                      <Icon className="h-5 w-5 text-finance" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category} • {expense.date}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">₹{expense.amount}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Spending by Category</h3>
            <div className="glass-panel p-6">
              <div className="mb-6 flex h-4 overflow-hidden rounded-full">
                {categoryBreakdown.map((cat, i) => (
                  <div
                    key={cat.category}
                    className={cn("transition-all", cat.color)}
                    style={{ width: `${cat.percentage}%` }}
                  />
                ))}
              </div>
              <div className="space-y-4">
                {categoryBreakdown.map((cat) => {
                  const Icon = categoryIcons[cat.category] || Wallet;
                  return (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-3 w-3 rounded-full", cat.color)} />
                        <span className="text-sm">{cat.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{cat.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {cat.percentage}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
