import { RouterProvider } from "react-router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { router } from "./routes/router";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0d9488", // Teal-600
      light: "#f0fdfa", // Teal-50
      dark: "#0f766e", // Teal-700
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0f172a", // Slate-900
      light: "#334155",
      dark: "#020617",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    background: {
      default: "#fcfdfe",
      paper: "#ffffff",
    },
    divider: "#f1f5f9",
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
        },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
