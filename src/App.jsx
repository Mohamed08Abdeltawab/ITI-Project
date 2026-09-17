import { useMemo, useEffect } from "react";
import { RouterProvider } from "react-router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { router } from "./routes/router";
import { useThemeStore } from "./stores/useThemeStore";

export default function App() {
  const themeMode = useThemeStore((state) => state.themeMode);

  // Synchronize document root with the current mode
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themeMode]);

  // Dynamic Material UI Theme reacting to themeMode
  const theme = useMemo(() => {
    const isDark = themeMode === "dark";

    return createTheme({
      palette: {
        mode: themeMode,
        primary: {
          main: isDark ? "#14b8a6" : "#0d9488", // Teal-500 in dark, Teal-600 in light
          light: isDark ? "#2dd4bf" : "#f0fdfa",
          dark: isDark ? "#0f766e" : "#0f766e",
          contrastText: "#ffffff",
        },
        secondary: {
          main: isDark ? "#f8fafc" : "#0f172a",
          light: isDark ? "#ffffff" : "#334155",
          dark: isDark ? "#cbd5e1" : "#020617",
          contrastText: isDark ? "#0f172a" : "#ffffff",
        },
        background: {
          default: isDark ? "#0b1120" : "#f8fafc",
          paper: isDark ? "#1e293b" : "#ffffff",
        },
        text: {
          primary: isDark ? "#f8fafc" : "#0f172a",
          secondary: isDark ? "#94a3b8" : "#475569",
        },
        divider: isDark ? "#334155" : "#e2e8f0",
      },
      typography: {
        fontFamily:
          '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        button: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 16,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: isDark ? "#0b1120" : "#f8fafc",
              color: isDark ? "#f8fafc" : "#0f172a",
              transition: "background-color 0.25s ease, color 0.25s ease",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              borderRadius: 12,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 20,
              backgroundImage: "none",
              transition:
                "background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              transition: "background-color 0.25s ease, color 0.25s ease",
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundImage: "none",
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              color: isDark ? "#f8fafc" : "#0f172a",
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              "& fieldset": {
                borderColor: isDark ? "#334155" : "#e2e8f0",
              },
              "&:hover fieldset": {
                borderColor: isDark ? "#475569" : "#cbd5e1",
              },
              "&.Mui-focused fieldset": {
                borderColor: isDark ? "#14b8a6" : "#0d9488",
              },
            },
          },
        },
      },
    });
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
