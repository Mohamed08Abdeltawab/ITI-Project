import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { Box, Container, CssBaseline } from "@mui/material";

export default function RootLayout() {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Outlet />
        </Box>
      </Container>
    </>
  );
}
