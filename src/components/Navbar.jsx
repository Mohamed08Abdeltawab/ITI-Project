import { AppBar, Toolbar, Typography, Button, Box, Stack } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { NavLink } from "react-router";

export default function Navbar() {
  const getNavButtonSx = ({ isActive }) => ({
    color: isActive ? "common.white" : "rgba(255,255,255,0.85)",
    fontWeight: isActive ? 700 : 500,
    borderBottom: isActive ? "2px solid #fff" : "2px solid transparent",
    borderRadius: 0,
    textTransform: "none",
    fontSize: "0.95rem",
    "&:hover": {
      color: "common.white",
      bgcolor: "rgba(255,255,255,0.15)",
      borderBottom: "2px solid #fff",
    },
  });

  return (
    <AppBar position="sticky" color="primary" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box
          component={NavLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            color: "common.white",
          }}
        >
          <LocalHospitalIcon />
          <Typography variant="h6" fontWeight="bold">
            CarePoint
          </Typography>
        </Box>

        <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
          <Button
            component={NavLink}
            to="/doctors"
            sx={getNavButtonSx}
          >
            Doctors
          </Button>
          <Button
            component={NavLink}
            to="/appointments"
            sx={getNavButtonSx}
          >
            My Appointments
          </Button>
          <Button
            component={NavLink}
            to="/profile"
            sx={getNavButtonSx}
          >
            Profile
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
