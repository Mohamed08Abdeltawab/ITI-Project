import { Box, Stack, Typography, Button, Card } from "@mui/material";
import { NavLink } from "react-router";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";

export default function NotFoundPage() {
  return (
    <Box sx={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Card
        elevation={0}
        sx={(theme) => ({
          bgcolor: "background.paper",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "24px",
          p: { xs: 4, sm: 7 },
          textAlign: "center",
          maxWidth: 512,
          mx: "auto",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        })}
      >
        <Box
          sx={(theme) => ({
            width: 80,
            height: 80,
            borderRadius: "24px",
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(13, 148, 136, 0.2)"
                : "rgba(13, 148, 136, 0.1)",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(13, 148, 136, 0.3)"
                : "rgba(13, 148, 136, 0.2)"
            }`,
          })}
        >
          <SearchOffRoundedIcon sx={{ fontSize: 44 }} />
        </Box>

        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: "2.25rem", sm: "3rem" },
            fontWeight: 800,
            color: "text.primary",
            letterSpacing: "-0.025em",
            lineHeight: 1,
            mb: 1,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            letterSpacing: "-0.025em",
            mb: 1,
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            lineHeight: 1.6,
            maxWidth: 384,
            mx: "auto",
            mb: 4,
          }}
        >
          The page or medical specialist you are looking for might have been
          moved, renamed, or is temporarily unavailable.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "center" }}
        >
          <Button
            component={NavLink}
            to="/"
            variant="contained"
            startIcon={<HomeRoundedIcon />}
            sx={{
              fontWeight: 700,
              borderRadius: "12px",
              px: 2.5,
              py: 1.25,
              boxShadow: 1,
              textTransform: "none",
            }}
          >
            Go Back Home
          </Button>

          <Button
            component={NavLink}
            to="/doctors"
            variant="outlined"
            startIcon={<MedicalServicesRoundedIcon />}
            sx={(theme) => ({
              borderColor: theme.palette.divider,
              color: "text.secondary",
              fontWeight: 600,
              borderRadius: "12px",
              px: 2.5,
              py: 1.25,
              textTransform: "none",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(51, 65, 85, 0.4)"
                    : "rgba(241, 245, 249, 0.8)",
                borderColor: theme.palette.divider,
              },
            })}
          >
            Browse Doctors
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
