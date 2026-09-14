import { RouterProvider } from "react-router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { router } from "./routes/router";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00897b", // لون Teal مريح للعين
    },
    secondary: {
      main: "#0288d1",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}