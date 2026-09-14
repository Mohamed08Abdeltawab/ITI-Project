import { Typography, Button, Box } from "@mui/material";
import { NavLink } from "react-router";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "60vh",
        gap: 2,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />
      <Typography variant="h1" fontWeight="bold" color="error.main">
        404
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
        The page you're looking for doesn't exist. Let's get you back on track.
      </Typography>
      <Button
        component={NavLink}
        to="/"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Go Back Home
      </Button>
    </Box>
  );
}
