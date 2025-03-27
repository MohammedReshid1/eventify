import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Script to initially set the theme before any rendering to avoid flash of wrong theme
const colorThemeScript = `
(function() {
  try {
    // Try to get theme mode from localStorage
    const storageKey = "eventify-theme";
    let theme = localStorage.getItem(storageKey);
    
    // If not available or set to system, check system preference
    if (!theme || theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  } catch (e) {
    console.error('Error accessing localStorage:', e);
  }
})();
`;

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "eventify-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    
    // Check if a theme was already applied by our script in index.html
    const currentAppliedTheme = root.classList.contains("dark") ? "dark" : 
                                root.classList.contains("light") ? "light" : null;
    
    // Sync with our initial state if needed
    if (currentAppliedTheme && theme !== currentAppliedTheme && 
        (theme === "light" || theme === "dark")) {
      root.classList.remove(currentAppliedTheme);
      root.classList.add(theme);
    }
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
      return;
    }

    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Listen for system color scheme changes when theme is set to system
  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = window.document.documentElement;
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  }

  return (
    <>
      {/* Inject script into head to set theme before React loads */}
      <script dangerouslySetInnerHTML={{ __html: colorThemeScript }} />
      <ThemeProviderContext.Provider {...props} value={value}>
        {children}
      </ThemeProviderContext.Provider>
    </>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
} 