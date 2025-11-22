import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  show: boolean;
}

const ThemeToggle = ({ show }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Check initial theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') as "light" | "dark" | null;
    const root = document.documentElement;
    const initialTheme = savedTheme || (root.classList.contains("dark") ? "dark" : "light");
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = theme === "dark" ? "light" : "dark";
    
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <Button
        onClick={toggleTheme}
        size="lg"
        variant="outline"
        className="rounded-full bg-background/80 backdrop-blur-md border-2 border-border/50 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 p-3"
      >
        {theme === "dark" ? (
          <Sun className="h-6 w-6 text-yellow-500 transition-transform hover:rotate-180 duration-500" />
        ) : (
          <Moon className="h-6 w-6 text-purple-500 transition-transform hover:-rotate-12 duration-300" />
        )}
      </Button>
    </div>
  );
};

export default ThemeToggle;
