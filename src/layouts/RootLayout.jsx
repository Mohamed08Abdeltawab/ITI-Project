import { Outlet } from "react-router";
import { Box, Typography, Stack } from "@mui/material";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  return (
    <Box
      className="font-sans antialiased"
      sx={(theme) => ({
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: "background-color 0.25s ease, color 0.25s ease",
      })}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          flex: 1,
          maxWidth: 1280,
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 3, sm: 4 },
        }}
      >
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={(theme) => ({
          py: 4,
          mt: "auto",
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(11, 17, 32, 0.7)"
              : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(4px)",
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        })}
      >
        <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, sm: 3, lg: 4 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
              <Box
                sx={(theme) => ({
                  width: 28,
                  height: 28,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.palette.primary.contrastText,
                  boxShadow: 1,
                })}
              >
                <LocalHospitalRoundedIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography
                variant="body2"
                sx={(theme) => ({
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  letterSpacing: "-0.01em",
                })}
              >
                Care
                <span className="text-[var(--primary-color)]">
                  Point
                </span>{" "}
                Healthcare
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ alignItems: "center", gap: 0.75 }}>
              <VerifiedUserRoundedIcon
                sx={(theme) => ({
                  fontSize: 16,
                  color: theme.palette.primary.main,
                })}
              />
              <Typography
                variant="caption"
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  fontSize: "0.75rem",
                })}
              >
                Verified Medical Provider Network • HIPAA Compliant
              </Typography>
            </Stack>

            <Typography
              variant="caption"
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                fontWeight: 400,
                textAlign: { xs: "center", sm: "right" },
                fontSize: "0.75rem",
              })}
            >
              © {new Date().getFullYear()} CarePoint. All rights reserved.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
