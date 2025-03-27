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
  // Initialize from localStorage, with fallback to defaultTheme
  const [theme, setTheme] = useState<Theme>(() => {
    // SSR check - if window is not defined, return defaultTheme
    if (typeof window === 'undefined') return defaultTheme;
    
    try {
      const storedTheme = window.localStorage.getItem(storageKey) as Theme;
      return storedTheme || defaultTheme;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return defaultTheme;
    }
  });

  // Listen for changes in system color scheme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Apply theme to document, but only if not already initialized by the script in index.html
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Check if theme was already initialized by our script in index.html
    const isThemeInitialized = root.classList.contains('theme-initialized');
    
    // If already initialized on first render, don't do anything
    if (isThemeInitialized && root.getAttribute('data-react-theme-set') !== 'true') {
      root.setAttribute('data-react-theme-set', 'true');
      return;
    }

    // Normal theme application
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Mark that React has set the theme
    root.setAttribute('data-react-theme-set', 'true');
  }, [theme]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [storageKey, theme]);

  // Define value for context
  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };

  return (
    <>
      {/* Inject script into head to set theme before React loads */}
      <script dangerouslySetInnerHTML={{ __html: colorThemeScript }} />
      <ThemeProviderContext.Provider {...props} value={value}>
        {children}
      </ThemeProviderContext.Provider>
    </>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}; 