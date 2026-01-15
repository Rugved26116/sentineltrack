import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  Dumbbell,
  Wallet,
  BookOpen,
  Download,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Academic", href: "/academic", icon: GraduationCap, color: "academic" },
  { name: "Health", href: "/health", icon: Dumbbell, color: "health" },
  { name: "Finance", href: "/finance", icon: Wallet, color: "finance" },
  { name: "Reflection", href: "/reflection", icon: BookOpen, color: "reflection" },
];

const secondaryNav = [
  { name: "Export Data", href: "/export", icon: Download },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">L</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">LifeTrack</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Overview
          </div>
          {navigation.slice(0, 2).map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}

          <div className="mb-2 mt-6 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Domains
          </div>
          {navigation.slice(2).map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? item.color === "academic"
                      ? "bg-academic-muted text-academic"
                      : item.color === "health"
                      ? "bg-health-muted text-health"
                      : item.color === "finance"
                      ? "bg-finance-muted text-finance"
                      : "bg-reflection-muted text-reflection"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )
              }
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  location.pathname === item.href &&
                    (item.color === "academic"
                      ? "text-academic"
                      : item.color === "health"
                      ? "text-health"
                      : item.color === "finance"
                      ? "text-finance"
                      : "text-reflection")
                )}
              />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Secondary Navigation */}
        <div className="border-t border-border px-3 py-4">
          {secondaryNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
          
          {user && (
            <Button
              variant="ghost"
              onClick={signOut}
              className="mt-2 w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
