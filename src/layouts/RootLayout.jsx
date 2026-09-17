import { Outlet } from "react-router";
import { Box, Typography, Stack } from "@mui/material";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  return (
    <Box className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased transition-colors duration-200">
      <Navbar />

      <Box
        component="main"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      >
        <Outlet />
      </Box>

      <Box
        component="footer"
        className="py-8 border-t border-[var(--border-color)] bg-white/70 dark:bg-[#0b1120]/70 backdrop-blur-sm mt-auto transition-colors duration-200"
      >
        <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            className="items-center justify-between gap-4"
          >
            <Stack direction="row" className="items-center gap-2">
              <Box className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
                <LocalHospitalRoundedIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography
                variant="body2"
                className="font-bold text-[var(--text-primary)] tracking-tight"
              >
                Care
                <span className="text-teal-600 dark:text-teal-400">
                  Point
                </span>{" "}
                Healthcare
              </Typography>
            </Stack>

            <Stack
              direction="row"
              className="items-center gap-1.5 text-xs text-[var(--text-secondary)]"
            >
              <VerifiedUserRoundedIcon
                sx={{ fontSize: 16, color: "#0d9488" }}
              />
              <Typography
                variant="caption"
                className="text-[var(--text-secondary)] font-medium"
              >
                Verified Medical Provider Network • HIPAA Compliant
              </Typography>
            </Stack>

            <Typography
              variant="caption"
              className="text-xs text-slate-400 dark:text-slate-500 font-normal text-center sm:text-right"
            >
              © {new Date().getFullYear()} CarePoint. All rights reserved.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
