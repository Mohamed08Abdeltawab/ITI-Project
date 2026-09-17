import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Stack,
  Typography,
  Card,
  CardMedia,
  Chip,
  Button,
  Alert,
  Divider,
  Skeleton,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { getDoctorById } from "../services/api";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    let isMounted = true;
    getDoctorById(id)
      .then((res) => {
        if (!isMounted) return;
        setDoctor(res.data);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err.response?.data?.message || "Could not retrieve doctor details.",
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1024, mx: "auto", py: 2, display: "flex", flexDirection: "column", gap: 3 }}>
        <Skeleton
          variant="rounded"
          width={140}
          height={36}
          sx={{ borderRadius: "12px" }}
        />
        <Card
          elevation={0}
          sx={(theme) => ({
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          })}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" } }}>
            <Box sx={{ gridColumn: { md: "span 5" }, minHeight: { xs: 340, md: 480 } }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ minHeight: 340 }}
              />
            </Box>
            <Box sx={{ gridColumn: { md: "span 7" }, p: { xs: 3, sm: 4, md: 5 }, display: "flex", flexDirection: "column", gap: 2 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="30%" height={24} />
              <Skeleton
                variant="rectangular"
                height={90}
                sx={{ borderRadius: "12px" }}
              />
              <Skeleton
                variant="rectangular"
                height={50}
                sx={{ borderRadius: "12px" }}
              />
            </Box>
          </Box>
        </Card>
      </Box>
    );
  }

  if (error || !doctor) {
    return (
      <Box sx={{ py: 4, maxWidth: 576, mx: "auto", textAlign: "center", display: "flex", flexDirection: "column", gap: 2 }}>
        <Alert severity="error" sx={{ borderRadius: "16px", textAlign: "left" }}>
          {error || "Doctor profile not found"}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/doctors")}
          sx={{ borderRadius: "12px", fontWeight: 600 }}
        >
          Back to Doctors List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1024, mx: "auto", py: 1, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Navigation Breadcrumb / Back Button */}
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/doctors")}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
            fontWeight: 600,
            fontSize: "0.875rem",
            borderRadius: "12px",
            py: 1,
            px: 1.5,
          }}
        >
          Back to Specialists
        </Button>

        <Chip
          icon={
            <VerifiedRoundedIcon
              sx={{ fontSize: 16, "&&": { color: "primary.main" } }}
            />
          }
          label="Verified Specialist"
          size="small"
          sx={(theme) => ({
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(13, 148, 136, 0.2)"
                : "rgba(13, 148, 136, 0.08)",
            color: theme.palette.primary.main,
            fontWeight: 700,
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(13, 148, 136, 0.3)"
                : "rgba(13, 148, 136, 0.2)"
            }`,
            fontSize: "0.75rem",
          })}
        />
      </Stack>

      {/* Doctor Profile Main Card */}
      <Card
        elevation={0}
        sx={(theme) => ({
          bgcolor: "background.paper",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        })}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" } }}>
          {/* Doctor Portrait Column */}
          <Box
            sx={(theme) => ({
              gridColumn: { md: "span 5" },
              position: "relative",
              bgcolor: theme.palette.mode === "dark" ? "slate.900" : "grey.100",
              minHeight: { xs: 340, md: "100%" },
              borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 0 },
              borderRight: { md: `1px solid ${theme.palette.divider}` },
              overflow: "hidden",
            })}
          >
            <CardMedia
              component="img"
              image={doctor.avatar}
              alt={doctor.name}
              sx={{
                width: "100%",
                height: { xs: 340, sm: 400, md: "100%" },
                position: { md: "absolute" },
                inset: 0,
                objectFit: "cover",
                objectPosition: "top center",
                display: "block",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600&h=600";
              }}
            />
            <Box
              sx={(theme) => ({
                position: "absolute",
                bottom: 16,
                right: 16,
                bgcolor: theme.palette.success.main,
                color: theme.palette.success.contrastText,
                p: 1,
                borderRadius: "50%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${theme.palette.background.paper}`,
                zIndex: 2,
              })}
            >
              <VerifiedRoundedIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>

          {/* Doctor Details Column */}
          <Box
            sx={{
              gridColumn: { md: "span 7" },
              p: { xs: 3, sm: 4, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {/* Header Badges */}
              <Stack
                direction="row"
                sx={{ items: "center", gap: 1, mb: 2, flexWrap: "wrap" }}
              >
                <Chip
                  label={doctor.specialty}
                  color="primary"
                  sx={{ fontWeight: 700, fontSize: "0.75rem", height: 28, borderRadius: "8px" }}
                />
                <Chip
                  icon={
                    <StarRoundedIcon
                      sx={{ "&&": { color: "warning.main" }, fontSize: 18 }}
                    />
                  }
                  label={`${doctor.rating} Rating (${doctor.reviewsCount || 124} reviews)`}
                  sx={(theme) => ({
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(245, 158, 11, 0.15)"
                        : "rgba(245, 158, 11, 0.1)",
                    color: theme.palette.warning.main,
                    border: `1px solid ${
                      theme.palette.mode === "dark"
                        ? "rgba(245, 158, 11, 0.3)"
                        : "rgba(245, 158, 11, 0.2)"
                    }`,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    height: 28,
                    borderRadius: "8px",
                  })}
                />
                <Chip
                  icon={
                    <WorkHistoryRoundedIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                  }
                  label={doctor.experience || "10 yrs experience"}
                  sx={(theme) => ({
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(51, 65, 85, 0.5)"
                        : "rgba(241, 245, 249, 0.8)",
                    color: theme.palette.text.secondary,
                    border: `1px solid ${theme.palette.divider}`,
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    height: 28,
                    borderRadius: "8px",
                  })}
                />
              </Stack>

              {/* Doctor Name & Specialty subtitle */}
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.875rem" },
                  fontWeight: 800,
                  color: "text.primary",
                  letterSpacing: "-0.025em",
                }}
              >
                {doctor.name}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  mt: 0.5,
                  mb: 2,
                }}
              >
                Consultant • {doctor.specialty} Specialist
              </Typography>

              {/* Bio description */}
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                {doctor.bio}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Working Schedule & Days */}
              <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                  <CalendarMonthRoundedIcon
                    sx={{ fontSize: 18, color: "primary.main" }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Available Working Days
                  </Typography>
                </Stack>

                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                  {Array.isArray(doctor.workingDays) &&
                    doctor.workingDays.map((day) => (
                      <Chip
                        key={day}
                        label={day}
                        size="medium"
                        sx={(theme) => ({
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(51, 65, 85, 0.5)"
                              : "rgba(241, 245, 249, 0.8)",
                          color: theme.palette.text.primary,
                          fontWeight: 700,
                          borderRadius: "12px",
                          px: 1,
                          fontSize: "0.75rem",
                        })}
                      />
                    ))}
                </Stack>
              </Box>

              {/* Available Time Slots */}
              <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                  <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                    <AccessTimeRoundedIcon
                      sx={{ fontSize: 18, color: "primary.main" }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: "text.primary",
                        fontSize: "0.875rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Available Consultation Slots
                    </Typography>
                  </Stack>
                  {selectedSlot && (
                    <Typography
                      variant="caption"
                      sx={{ color: "primary.main", fontWeight: 700, fontSize: "0.75rem" }}
                    >
                      Selected: {selectedSlot}
                    </Typography>
                  )}
                </Stack>

                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                  {Array.isArray(doctor.slots) &&
                    doctor.slots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <Chip
                          key={slot}
                          label={slot}
                          clickable
                          onClick={() => setSelectedSlot(slot)}
                          sx={(theme) => ({
                            borderRadius: "12px",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            py: 0.75,
                            px: 0.5,
                            transition: "all 0.2s",
                            ...(isSelected
                              ? {
                                  bgcolor: theme.palette.primary.main,
                                  color: theme.palette.primary.contrastText,
                                  "&:hover": {
                                    bgcolor: theme.palette.primary.dark,
                                  },
                                }
                              : {
                                  bgcolor:
                                    theme.palette.mode === "dark"
                                      ? "rgba(13, 148, 136, 0.15)"
                                      : "rgba(13, 148, 136, 0.08)",
                                  border: `1px solid ${
                                    theme.palette.mode === "dark"
                                      ? "rgba(13, 148, 136, 0.3)"
                                      : "rgba(13, 148, 136, 0.2)"
                                  }`,
                                  color: theme.palette.primary.main,
                                  "&:hover": {
                                    bgcolor:
                                      theme.palette.mode === "dark"
                                        ? "rgba(13, 148, 136, 0.25)"
                                        : "rgba(13, 148, 136, 0.15)",
                                  },
                                }),
                          })}
                        />
                      );
                    })}
                </Stack>
              </Box>
            </Box>

            {/* Bottom Action CTA Banner */}
            <Box
              sx={(theme) => ({
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(15, 23, 42, 0.6)"
                    : "rgba(248, 250, 252, 0.8)",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "16px",
                p: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mt: "auto",
              })}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                    display: "block",
                    fontSize: "0.75rem",
                  }}
                >
                  Standard Consultation Fee
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "primary.main",
                    lineHeight: 1,
                  }}
                >
                  {doctor.fee || "$120"}
                  <Box
                    component="span"
                    sx={{
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      fontWeight: 400,
                      ml: 0.5,
                    }}
                  >
                    / comprehensive visit
                  </Box>
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<EventAvailableRoundedIcon />}
                onClick={() => navigate(`/book/${doctor.id}`)}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  fontWeight: 700,
                  borderRadius: "12px",
                  px: 3,
                  py: 1.25,
                  boxShadow: 1,
                }}
              >
                Book Appointment With {doctor.name.split(" ")[1] || "Doctor"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
