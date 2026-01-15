import { useState } from "react";
import { Plus, Wallet, TrendingUp, TrendingDown, Coffee, Car, ShoppingBag, Utensils, Home, Gamepad, Trash2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useExpenses } from "@/hooks/useExpenses";
import { format, parseISO, isToday, isThisWeek, isThisMonth } from "date-fns";

const categoryIcons: Record<string, typeof Coffee> = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Entertainment: Gamepad,
  Housing: Home,
  Coffee: Coffee,
  Other: Wallet,
};

const categories = ["Food", "Transport", "Shopping", "Entertainment", "Housing", "Coffee", "Other"];

export default function FinancePage() {
  const { expenses, isLoading, addExpense, deleteExpense } = useExpenses();
  const [isOpen, setIsOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    description: "",
    expense_date: format(new Date(), "yyyy-MM-dd"),
  });

  const handleSubmit = () => {
    if (!newExpense.amount || !newExpense.category) return;
    addExpense.mutate({
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description || null,
      expense_date: newExpense.expense_date,
    });
    setNewExpense({
      amount: "",
      category: "",
      description: "",
      expense_date: format(new Date(), "yyyy-MM-dd"),
    });
    setIsOpen(false);
  };

  const todayTotal = expenses
    .filter((e) => isToday(parseISO(e.expense_date)))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const weekTotal = expenses
    .filter((e) => isThisWeek(parseISO(e.expense_date)))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const monthTotal = expenses
    .filter((e) => isThisMonth(parseISO(e.expense_date)))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {} as Record<string, number>);

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const categoryColors: Record<string, string> = {
    Food: "bg-finance",
    Transport: "bg-health",
    Shopping: "bg-academic",
    Entertainment: "bg-reflection",
    Housing: "bg-primary",
    Coffee: "bg-finance",
    Other: "bg-muted-foreground",
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-finance border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl animate-fade-in">
        <PageHeader
          title="Personal Finance 💰"
          description="Track your spending and build financial discipline"
          actions={
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-finance text-finance-foreground hover:bg-finance/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount (₹)</Label>
                      <Input
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newExpense.expense_date}
                        onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Input
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      placeholder="e.g., Lunch at cafe"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-finance text-finance-foreground hover:bg-finance/90"
                    disabled={!newExpense.amount || !newExpense.category}
                  >
                    Add Expense
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          }
        />

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">₹{todayTotal.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">₹{weekTotal.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">₹{monthTotal.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Expense List */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-lg font-semibold">Recent Expenses</h3>
            {expenses.length === 0 ? (
              <div className="glass-panel flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 rounded-full bg-finance-muted p-4">
                  <Wallet className="h-8 w-8 text-finance" />
                </div>
                <h3 className="mb-2 font-semibold">No expenses yet</h3>
                <p className="text-sm text-muted-foreground">
                  Add your first expense to start tracking
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense, index) => {
                  const Icon = categoryIcons[expense.category] || Wallet;
                  return (
                    <div
                      key={expense.id}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all animate-slide-up hover:border-finance/30"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="rounded-lg bg-finance-muted p-2">
                        <Icon className="h-5 w-5 text-finance" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{expense.description || expense.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {expense.category} • {format(parseISO(expense.expense_date), "MMM d")}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">₹{Number(expense.amount).toLocaleString()}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 transition-opacity group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteExpense.mutate(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Spending by Category</h3>
            <div className="glass-panel p-6">
              {categoryBreakdown.length > 0 ? (
                <>
                  <div className="mb-6 flex h-4 overflow-hidden rounded-full">
                    {categoryBreakdown.map((cat) => (
                      <div
                        key={cat.category}
                        className={cn("transition-all", categoryColors[cat.category] || "bg-muted")}
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
                            <div className={cn("h-3 w-3 rounded-full", categoryColors[cat.category] || "bg-muted")} />
                            <span className="text-sm">{cat.category}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{cat.amount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              {cat.percentage}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No spending data yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
