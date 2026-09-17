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
      <Box className="space-y-6 max-w-5xl mx-auto py-4">
        <Skeleton
          variant="rounded"
          width={140}
          height={36}
          className="rounded-xl"
        />
        <Card
          elevation={0}
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-xs"
        >
          <Box className="grid grid-cols-1 md:grid-cols-12">
            <Box className="md:col-span-5 min-h-[340px] md:min-h-[480px]">
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                className="w-full h-full min-h-[340px]"
              />
            </Box>
            <Box className="md:col-span-7 p-6 sm:p-8 md:p-10 space-y-4">
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="30%" height={24} />
              <Skeleton
                variant="rectangular"
                height={90}
                className="rounded-xl"
              />
              <Skeleton
                variant="rectangular"
                height={50}
                className="rounded-xl"
              />
            </Box>
          </Box>
        </Card>
      </Box>
    );
  }

  if (error || !doctor) {
    return (
      <Box className="py-8 max-w-xl mx-auto text-center space-y-4">
        <Alert severity="error" className="rounded-2xl text-left">
          {error || "Doctor profile not found"}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/doctors")}
          className="rounded-xl font-semibold border-slate-200 text-slate-700"
        >
          Back to Doctors List
        </Button>
      </Box>
    );
  }

  return (
    <Box className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Navigation Breadcrumb / Back Button */}
      <Stack direction="row" className="items-center justify-between">
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/doctors")}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-sm rounded-xl py-2 px-3"
        >
          Back to Specialists
        </Button>

        <Chip
          icon={
            <VerifiedRoundedIcon
              sx={{ fontSize: 16, "&&": { color: "#0d9488" } }}
            />
          }
          label="Verified Specialist"
          size="small"
          className="bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-bold border border-teal-200/70 dark:border-teal-800/70 text-xs"
        />
      </Stack>

      {/* Doctor Profile Main Card */}
      <Card
        elevation={0}
        className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-xs"
      >
        <Box className="grid grid-cols-1 md:grid-cols-12">
          {/* Doctor Portrait Column */}
          <Box className="md:col-span-5 relative bg-slate-100 dark:bg-slate-900 min-h-[340px] md:min-h-full border-b md:border-b-0 md:border-r border-[var(--border-color)] overflow-hidden">
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
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                bgcolor: "#10b981",
                color: "#ffffff",
                p: 1,
                borderRadius: "50%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #ffffff",
                zIndex: 2,
              }}
            >
              <VerifiedRoundedIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>

          {/* Doctor Details Column */}
          <Box className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            <Box>
              {/* Header Badges */}
              <Stack
                direction="row"
                className="items-center gap-2 mb-3 flex-wrap"
              >
                <Chip
                  label={doctor.specialty}
                  className="bg-teal-600 text-white font-bold text-xs h-7 rounded-lg shadow-xs"
                />
                <Chip
                  icon={
                    <StarRoundedIcon
                      sx={{ "&&": { color: "#f59e0b" }, fontSize: 18 }}
                    />
                  }
                  label={`${doctor.rating} Rating (${doctor.reviewsCount || 124} reviews)`}
                  className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 font-semibold text-xs h-7 rounded-lg"
                />
                <Chip
                  icon={
                    <WorkHistoryRoundedIcon
                      sx={{ fontSize: 16, color: "#64748b" }}
                    />
                  }
                  label={doctor.experience || "10 yrs experience"}
                  className="bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 font-medium text-xs h-7 rounded-lg"
                />
              </Stack>

              {/* Doctor Name & Specialty subtitle */}
              <Typography
                variant="h4"
                component="h1"
                className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight"
              >
                {doctor.name}
              </Typography>

              <Typography
                variant="body2"
                className="text-teal-700 dark:text-teal-400 font-semibold text-sm mt-0.5 mb-4"
              >
                Consultant • {doctor.specialty} Specialist
              </Typography>

              {/* Bio description */}
              <Typography
                variant="body1"
                className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-6"
              >
                {doctor.bio}
              </Typography>

              <Divider className="my-6 border-[var(--border-color)]" />

              {/* Working Schedule & Days */}
              <Box className="mb-6 space-y-3">
                <Stack direction="row" className="items-center gap-2">
                  <CalendarMonthRoundedIcon
                    sx={{ fontSize: 18, color: "#0d9488" }}
                  />
                  <Typography
                    variant="subtitle2"
                    className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider"
                  >
                    Available Working Days
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} className="flex-wrap gap-2">
                  {Array.isArray(doctor.workingDays) &&
                    doctor.workingDays.map((day) => (
                      <Chip
                        key={day}
                        label={day}
                        size="medium"
                        className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl px-2 text-xs"
                      />
                    ))}
                </Stack>
              </Box>

              {/* Available Time Slots */}
              <Box className="mb-8 space-y-3">
                <Stack direction="row" className="items-center justify-between">
                  <Stack direction="row" className="items-center gap-2">
                    <AccessTimeRoundedIcon
                      sx={{ fontSize: 18, color: "#0d9488" }}
                    />
                    <Typography
                      variant="subtitle2"
                      className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider"
                    >
                      Available Consultation Slots
                    </Typography>
                  </Stack>
                  {selectedSlot && (
                    <Typography
                      variant="caption"
                      className="text-teal-700 dark:text-teal-400 font-bold text-xs"
                    >
                      Selected: {selectedSlot}
                    </Typography>
                  )}
                </Stack>

                <Stack direction="row" className="flex-wrap gap-2">
                  {Array.isArray(doctor.slots) &&
                    doctor.slots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <Chip
                          key={slot}
                          label={slot}
                          clickable
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-xl font-semibold text-xs py-1.5 px-1 transition-all ${
                            isSelected
                              ? "bg-teal-600 text-white shadow-xs"
                              : "bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/70 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50"
                          }`}
                        />
                      );
                    })}
                </Stack>
              </Box>
            </Box>

            {/* Bottom Action CTA Banner */}
            <Box className="bg-slate-50 dark:bg-slate-900/60 border border-[var(--border-color)] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
              <Box>
                <Typography
                  variant="caption"
                  className="text-[var(--text-secondary)] font-medium block text-xs"
                >
                  Standard Consultation Fee
                </Typography>
                <Typography
                  variant="h6"
                  className="font-extrabold text-teal-600 dark:text-teal-400 leading-none"
                >
                  {doctor.fee || "$120"}
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-normal ml-1">
                    / comprehensive visit
                  </span>
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<EventAvailableRoundedIcon />}
                onClick={() => navigate(`/book/${doctor.id}`)}
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-6 py-2.5 shadow-sm"
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
