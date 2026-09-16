import { Box, Stack, Typography, Button, Card } from "@mui/material";
import { NavLink } from "react-router";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";

export default function NotFoundPage() {
  return (
    <Box className="min-h-[75vh] flex items-center justify-center p-4">
      <Card
        elevation={0}
        className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/90 rounded-3xl p-8 sm:p-14 text-center max-w-lg mx-auto shadow-sm"
      >
        <Box className="w-20 h-20 rounded-3xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-6 shadow-xs border border-teal-100 dark:border-teal-900/60">
          <SearchOffRoundedIcon sx={{ fontSize: 44 }} />
        </Box>

        <Typography
          variant="h2"
          component="h1"
          className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-2"
        >
          404
        </Typography>

        <Typography
          variant="h6"
          className="font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-2"
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body2"
          className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto mb-8"
        >
          The page or medical specialist you are looking for might have been
          moved, renamed, or is temporarily unavailable.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          className="justify-center"
        >
          <Button
            component={NavLink}
            to="/"
            variant="contained"
            startIcon={<HomeRoundedIcon />}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-5 py-2.5 shadow-xs"
          >
            Go Back Home
          </Button>

          <Button
            component={NavLink}
            to="/doctors"
            variant="outlined"
            startIcon={<MedicalServicesRoundedIcon />}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-semibold rounded-xl px-5 py-2.5"
          >
            Browse Doctors
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
