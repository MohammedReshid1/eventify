
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  onThemeChange?: (value: string) => void;
  isButtonVariant?: boolean;
}

export function ThemeToggle({ onThemeChange, isButtonVariant = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  
  const handleThemeChange = (value: string) => {
    setTheme(value as "light" | "dark" | "system");
    if (onThemeChange) {
      onThemeChange(value);
    }
  };

  if (isButtonVariant) {
    return (
      <Button
        variant="outline"
        className="justify-start p-2 w-full"
        onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Moon className="mr-2 h-4 w-4" />
        ) : theme === "system" ? (
          <Monitor className="mr-2 h-4 w-4" />
        ) : (
          <Sun className="mr-2 h-4 w-4" />
        )}
        {theme === "dark" ? "Dark Mode" : theme === "system" ? "System Theme" : "Light Mode"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : theme === "system" ? (
            <Monitor className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
