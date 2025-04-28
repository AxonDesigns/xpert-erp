import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

type Theme = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {

  const updateTheme = useCallback((theme: Theme) => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark && !document.getElementsByTagName('html')[0].classList.contains('dark')) {
        document.getElementsByTagName('html')[0].classList.add('dark');
      } else if (!isDark && document.getElementsByTagName('html')[0].classList.contains('dark')) {
        document.getElementsByTagName('html')[0].classList.remove('dark');
      }
    } else {
      if (theme === 'dark' && !document.getElementsByTagName('html')[0].classList.contains('dark')) {
        document.getElementsByTagName('html')[0].classList.add('dark');
      } else if (theme === 'light' && document.getElementsByTagName('html')[0].classList.contains('dark')) {
        document.getElementsByTagName('html')[0].classList.remove('dark');
      }
    }
  }, []);

  const [theme, setTheme] = useState<Theme>(() => {
    const theme = localStorage.getItem('theme-mode') as Theme | null;
    if (!theme) {
      localStorage.setItem('theme-mode', 'system');
      updateTheme("system");
      return 'system';
    }

    updateTheme(theme);
    return theme;
  });



  useEffect(() => {
    localStorage.setItem('theme-mode', theme);
    updateTheme(theme);
  }, [theme, updateTheme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};