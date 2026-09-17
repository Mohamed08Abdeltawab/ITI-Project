import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  Box,
  Stack,
  Typography,
  Avatar,
  Badge,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function DoctorCard({ doctor, onToggleFavorite, isFav }) {
  const navigate = useNavigate();
  const [internalFavorite, setInternalFavorite] = useState(false);

  const isFavorite = isFav !== undefined ? isFav : internalFavorite;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(doctor);
    } else {
      setInternalFavorite((prev) => !prev);
    }
  };

  // Derive schedule string if not directly present
  const scheduleText =
    doctor.workingSchedule ||
    (Array.isArray(doctor.workingDays) && doctor.workingDays.length > 0
      ? `${doctor.workingDays[0]} - ${
          doctor.workingDays[doctor.workingDays.length - 1]
        } (09:00 - 18:00)`
      : "Mon - Thu (09:00 - 18:00)");

  return (
    <Card
      elevation={0}
      className="bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-teal-300 dark:hover:border-teal-500/60 hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col justify-between h-full group"
    >
      <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full">
        <Box>
          {/* Top Row: Avatar with online badge + Doctor Info + Favorite Button */}
          <Stack direction="row" className="items-start justify-between gap-3">
            <Stack direction="row" className="items-center gap-3.5 min-w-0">
              {/* Avatar with active green indicator */}
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#10b981",
                    color: "#10b981",
                    boxShadow: "0 0 0 2px #ffffff",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                  },
                }}
              >
                <Avatar
                  src={doctor.avatar}
                  alt={doctor.name}
                  variant="rounded"
                  className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 object-cover shadow-xs"
                  imgProps={{
                    onError: (e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=400";
                    },
                  }}
                />
              </Badge>

              {/* Name + Specialty + Experience */}
              <Box className="min-w-0">
                <Typography
                  variant="subtitle1"
                  className="font-bold text-[var(--text-primary)] text-base leading-tight truncate"
                >
                  {doctor.name}
                </Typography>

                <Stack
                  direction="row"
                  className="items-center gap-2 mt-1.5 flex-wrap"
                >
                  <Chip
                    label={doctor.specialty}
                    size="small"
                    className="bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 font-semibold text-xs h-6 rounded-md"
                  />
                  <Typography
                    variant="caption"
                    className="text-[var(--text-secondary)] font-medium text-xs whitespace-nowrap"
                  >
                    {doctor.experience || "10 yrs exp"}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            {/* Favorite Action Button */}
            <Tooltip
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              arrow
            >
              <IconButton
                size="small"
                onClick={handleFavoriteClick}
                aria-label="Add to favorites"
                className={`w-9 h-9 rounded-xl border transition-colors shrink-0 ${
                  isFavorite
                    ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {isFavorite ? (
                  <FavoriteRoundedIcon sx={{ fontSize: 18 }} />
                ) : (
                  <FavoriteBorderRoundedIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Rating Pill */}
          <Box className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/70 rounded-lg px-2.5 py-1 mt-3 mb-2.5">
            <StarRoundedIcon sx={{ fontSize: 17, color: "#f59e0b" }} />
            <Typography
              variant="caption"
              className="font-bold text-[var(--text-primary)] text-xs"
            >
              {doctor.rating}
            </Typography>
            <Typography
              variant="caption"
              className="text-[var(--text-muted)] text-xs font-normal"
            >
              ({doctor.reviewsCount || 124} reviews)
            </Typography>
          </Box>

          {/* Bio Snippet */}
          <Typography
            variant="body2"
            className="text-[var(--text-secondary)] text-xs sm:text-[13px] line-clamp-2 leading-relaxed mb-3.5"
          >
            {doctor.bio}
          </Typography>

          {/* Schedule / Hours */}
          <Box className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/70 text-[var(--text-secondary)] text-xs font-medium px-2.5 py-1.5 rounded-lg mb-4 w-full">
            <CalendarMonthRoundedIcon
              sx={{ fontSize: 15, color: "#0d9488" }}
              className="shrink-0"
            />
            <Typography
              variant="caption"
              className="truncate text-[var(--text-secondary)] text-xs font-medium"
            >
              {scheduleText}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[var(--border-color)]">
          <Button
            variant="outlined"
            onClick={() => navigate(`/doctors/${doctor.id}`)}
            className="w-full py-2 px-3 border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
          >
            View Profile
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate(`/book/${doctor.id}`)}
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
            className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
