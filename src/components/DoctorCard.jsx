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
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[4],
        },
      })}
    >
      <CardContent
        sx={{
          p: { xs: 2.5, sm: 3 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          "&:last-child": { pb: { xs: 2.5, sm: 3 } },
        }}
      >
        <Box>
          {/* Top Row: Avatar with online badge + Doctor Info + Favorite Button */}
          <Stack
            direction="row"
            sx={{
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <Stack
              direction="row"
              sx={{ alignItems: "center", gap: 1.75, minWidth: 0 }}
            >
              {/* Avatar with active green indicator */}
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={(theme) => ({
                  "& .MuiBadge-badge": {
                    bgcolor: theme.palette.success.main,
                    color: theme.palette.success.main,
                    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                  },
                })}
              >
                <Avatar
                  src={doctor.avatar}
                  alt={doctor.name}
                  variant="rounded"
                  sx={(theme) => ({
                    width: 56,
                    height: 56,
                    borderRadius: 3.5,
                    bgcolor:
                      theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                    boxShadow: 1,
                  })}
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
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={(theme) => ({
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontSize: "1rem",
                    lineHeight: 1.25,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  })}
                >
                  {doctor.name}
                </Typography>

                <Stack
                  direction="row"
                  sx={{ alignItems: "center", gap: 1, mt: 0.75, flexWrap: "wrap" }}
                >
                  <Chip
                    label={doctor.specialty}
                    size="small"
                    sx={(theme) => ({
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(20, 184, 166, 0.15)"
                          : "rgba(13, 148, 136, 0.08)",
                      color: theme.palette.primary.main,
                      border: `1px solid ${
                        theme.palette.mode === "dark"
                          ? "rgba(20, 184, 166, 0.3)"
                          : "rgba(13, 148, 136, 0.2)"
                      }`,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                      borderRadius: 1.5,
                    })}
                  />
                  <Typography
                    variant="caption"
                    sx={(theme) => ({
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      whiteSpace: "nowrap",
                    })}
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
                sx={(theme) => ({
                  width: 36,
                  height: 36,
                  borderRadius: 3,
                  border: `1px solid ${
                    isFavorite ? theme.palette.error.light : theme.palette.divider
                  }`,
                  bgcolor: isFavorite
                    ? theme.palette.mode === "dark"
                      ? "rgba(239, 68, 68, 0.15)"
                      : "rgba(239, 68, 68, 0.08)"
                    : theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "grey.50",
                  color: isFavorite
                    ? theme.palette.error.main
                    : theme.palette.text.secondary,
                  transition: "background-color 0.2s ease, border-color 0.2s ease",
                  flexShrink: 0,
                  "&:hover": {
                    bgcolor: isFavorite
                      ? theme.palette.mode === "dark"
                        ? "rgba(239, 68, 68, 0.25)"
                        : "rgba(239, 68, 68, 0.15)"
                      : theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "grey.100",
                  },
                })}
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
          <Box
            sx={(theme) => ({
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(30, 41, 59, 0.7)"
                  : "grey.50",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              px: 1.25,
              py: 0.5,
              mt: 1.5,
              mb: 1.25,
            })}
          >
            <StarRoundedIcon
              sx={(theme) => ({
                fontSize: 17,
                color: theme.palette.warning.main,
              })}
            />
            <Typography
              variant="caption"
              sx={(theme) => ({
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: "0.75rem",
              })}
            >
              {doctor.rating}
            </Typography>
            <Typography
              variant="caption"
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
                fontWeight: 400,
              })}
            >
              ({doctor.reviewsCount || 124} reviews)
            </Typography>
          </Box>

          {/* Bio Snippet */}
          <Typography
            variant="body2"
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              fontSize: { xs: "0.75rem", sm: "0.8125rem" },
              lineHeight: 1.5,
              mb: 1.75,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            })}
          >
            {doctor.bio}
          </Typography>

          {/* Schedule / Hours */}
          <Box
            sx={(theme) => ({
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(30, 41, 59, 0.7)"
                  : "grey.50",
              border: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.secondary,
              fontSize: "0.75rem",
              fontWeight: 500,
              px: 1.25,
              py: 0.75,
              borderRadius: 2,
              mb: 2,
              width: "100%",
            })}
          >
            <CalendarMonthRoundedIcon
              sx={(theme) => ({
                fontSize: 15,
                color: theme.palette.primary.main,
                flexShrink: 0,
              })}
            />
            <Typography
              variant="caption"
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              })}
            >
              {scheduleText}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={(theme) => ({
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.25,
            pt: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(`/doctors/${doctor.id}`)}
            sx={(theme) => ({
              width: "100%",
              py: 1,
              px: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.primary,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              textTransform: "none",
              transition: "background-color 0.2s ease",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "grey.50",
                borderColor: theme.palette.divider,
              },
            })}
          >
            View Profile
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate(`/book/${doctor.id}`)}
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
            sx={(theme) => ({
              width: "100%",
              py: 1,
              px: 1.5,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              textTransform: "none",
              boxShadow: 1,
              transition: "background-color 0.2s ease",
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            })}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
