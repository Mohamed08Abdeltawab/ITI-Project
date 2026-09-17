import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Skeleton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";

import {
  getAppointments,
  getDoctors,
  updateAppointment,
  deleteAppointment,
} from "../services/api";

const DEFAULT_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "11:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:00 PM",
];

const STATUS_TABS = ["Upcoming", "Completed", "Cancelled", "All"];

export default function AppointmentsPage() {
  const navigate = useNavigate();

  // Data state
  const [appointments, setAppointments] = useState([]);
  const [doctorsMap, setDoctorsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active status filter tab: "Upcoming", "Completed", "Cancelled", or "All"
  const [statusFilter, setStatusFilter] = useState("Upcoming");

  // Reschedule / Edit Modal state
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editSlot, setEditSlot] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Cancel Confirmation Modal state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Toast / Feedback Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const today = new Date().toISOString().split("T")[0];

  // Fetch appointments and doctors list to enrich appointments with avatars & specialties
  const fetchAppointments = useCallback(() => {
    let isMounted = true;
    Promise.all([getAppointments(), getDoctors().catch(() => ({ data: [] }))])
      .then(([appointmentsRes, doctorsRes]) => {
        if (!isMounted) return;
        const appData = Array.isArray(appointmentsRes.data)
          ? appointmentsRes.data
          : [];
        const docData = Array.isArray(doctorsRes.data) ? doctorsRes.data : [];

        const docMap = {};
        docData.forEach((doc) => {
          if (doc && doc.id) {
            docMap[String(doc.id)] = doc;
          }
        });

        setAppointments(appData);
        setDoctorsMap(docMap);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching appointments:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load appointments. Please ensure json-server is running on port 5000.",
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return fetchAppointments();
  }, [fetchAppointments]);

  const handleRefresh = () => {
    setLoading(true);
    fetchAppointments();
  };

  // Tab counts
  const counts = useMemo(() => {
    return {
      Upcoming: appointments.filter((a) => a.status === "Upcoming").length,
      Completed: appointments.filter((a) => a.status === "Completed").length,
      Cancelled: appointments.filter((a) => a.status === "Cancelled").length,
      All: appointments.length,
    };
  }, [appointments]);

  // Filtered appointments by selected status tab
  const filteredAppointments = useMemo(() => {
    if (statusFilter === "All") return appointments;
    return appointments.filter((a) => a.status === statusFilter);
  }, [appointments, statusFilter]);

  // Helper to open the Reschedule modal
  const handleOpenReschedule = (app) => {
    setSelectedAppointment(app);
    setEditDate(app.date || today);
    setEditSlot(app.timeSlot || DEFAULT_SLOTS[0]);
    setEditNotes(app.notes || "");
    setRescheduleDialogOpen(true);
  };

  // Submit Reschedule (Update)
  const handleConfirmReschedule = async (e) => {
    if (e) e.preventDefault();
    if (!selectedAppointment) return;

    setIsUpdating(true);
    const updatedPayload = {
      date: editDate,
      timeSlot: editSlot,
      notes: editNotes.trim(),
      status: "Upcoming", // Keep or set to upcoming on reschedule
    };

    try {
      const res = await updateAppointment(
        selectedAppointment.id,
        updatedPayload,
      );

      // Update local state directly without full page reload
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === selectedAppointment.id
            ? { ...item, ...(res.data || updatedPayload) }
            : item,
        ),
      );

      setSnackbar({
        open: true,
        message: "Appointment rescheduled successfully!",
        severity: "success",
      });
      setRescheduleDialogOpen(false);
    } catch (err) {
      console.error("Reschedule failed:", err);
      setSnackbar({
        open: true,
        message: "Failed to update appointment. Please try again.",
        severity: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Cancel Dialog
  const handleOpenCancel = (app) => {
    setAppointmentToCancel(app);
    setCancelDialogOpen(true);
  };

  // Confirm Delete / Cancellation
  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) return;

    setIsCancelling(true);
    try {
      // Execute DELETE request via API layer
      await deleteAppointment(appointmentToCancel.id);

      // Immediately remove item from local UI state
      setAppointments((prev) =>
        prev.filter((item) => item.id !== appointmentToCancel.id),
      );

      setSnackbar({
        open: true,
        message: "Appointment cancelled and removed from your schedule.",
        severity: "info",
      });
      setCancelDialogOpen(false);
    } catch (err) {
      console.error("Delete failed:", err);
      setSnackbar({
        open: true,
        message: "Failed to cancel appointment. Please try again.",
        severity: "error",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Get available slots for the selected appointment doctor
  const currentDoctor = selectedAppointment
    ? doctorsMap[String(selectedAppointment.doctorId)]
    : null;
  const availableSlots =
    currentDoctor?.slots && currentDoctor.slots.length > 0
      ? currentDoctor.slots
      : DEFAULT_SLOTS;

  return (
    <Box sx={{ maxWidth: 1024, mx: "auto", py: 1, px: { xs: 1.5, sm: 2 }, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Top Header Banner */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={(theme) => ({
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Box>
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
            My Appointments
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.5 }}
          >
            Manage upcoming consultations, reschedule your dates, or review past
            visit records.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => navigate("/doctors")}
          sx={{
            fontWeight: 700,
            borderRadius: "12px",
            px: 2,
            py: 1.25,
            boxShadow: 1,
            textTransform: "none",
          }}
        >
          Book New Appointment
        </Button>
      </Stack>

      {/* Filter Tabs & Refresh Action */}
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          overflowX: "auto",
          pb: 0.5,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          {STATUS_TABS.map((status) => {
            const isActive = statusFilter === status;
            const count = counts[status] ?? 0;
            return (
              <Chip
                key={status}
                label={`${status} (${count})`}
                clickable
                onClick={() => setStatusFilter(status)}
                sx={(theme) => ({
                  borderRadius: "12px",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  fontWeight: 600,
                  transition: "all 0.2s",
                  px: 0.5,
                  py: 0.5,
                  ...(isActive
                    ? {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 700,
                        "&:hover": {
                          bgcolor: theme.palette.primary.dark,
                        },
                      }
                    : {
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(30, 41, 59, 0.7)"
                            : "rgba(241, 245, 249, 0.8)",
                        color: theme.palette.text.secondary,
                        border: `1px solid ${theme.palette.divider}`,
                        "&:hover": {
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(51, 65, 85, 0.8)"
                              : "rgba(226, 232, 240, 0.8)",
                          color: theme.palette.text.primary,
                        },
                      }),
                })}
              />
            );
          })}
        </Stack>

        <Tooltip title="Refresh appointments" arrow>
          <IconButton
            size="small"
            onClick={handleRefresh}
            disabled={loading}
            sx={(theme) => ({
              borderRadius: "12px",
              border: `1px solid ${theme.palette.divider}`,
              color: "text.secondary",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(51, 65, 85, 0.4)"
                    : "rgba(241, 245, 249, 0.8)",
              },
            })}
          >
            <RefreshRoundedIcon
              fontSize="small"
              sx={{
                color: loading ? "primary.main" : "inherit",
                ...(loading
                  ? {
                      animation: "spin 1s linear infinite",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }
                  : {}),
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Error Feedback Alert */}
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRefresh}
              startIcon={<RefreshRoundedIcon fontSize="small" />}
            >
              Retry
            </Button>
          }
          sx={{ borderRadius: "16px" }}
        >
          {error}
        </Alert>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <Stack spacing={3}>
          {[1, 2, 3].map((idx) => (
            <Card
              key={idx}
              elevation={0}
              sx={(theme) => ({
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: "background.paper",
                borderRadius: "16px",
                p: 3,
              })}
            >
              <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Stack direction="row" spacing={2.5} sx={{ alignItems: "center" }}>
                    <Skeleton
                      variant="circular"
                      width={64}
                      height={64}
                      sx={{ flexShrink: 0 }}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 200 }}>
                      <Skeleton variant="text" width="70%" height={26} />
                      <Skeleton variant="text" width="45%" height={18} />
                      <Skeleton variant="text" width="90%" height={18} />
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1.5} sx={{ alignSelf: { xs: "flex-end", sm: "auto" } }}>
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={36}
                      sx={{ borderRadius: "12px" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={36}
                      sx={{ borderRadius: "12px" }}
                    />
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Empty State Illustration */}
      {!loading && !error && filteredAppointments.length === 0 && (
        <Card
          elevation={0}
          sx={(theme) => ({
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "24px",
            p: { xs: 5, sm: 7 },
            textAlign: "center",
            maxWidth: 512,
            mx: "auto",
            my: 4,
          })}
        >
          <Box
            sx={(theme) => ({
              width: 72,
              height: 72,
              borderRadius: "16px",
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(13, 148, 136, 0.2)"
                  : "rgba(13, 148, 136, 0.1)",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(13, 148, 136, 0.3)"
                  : "rgba(13, 148, 136, 0.2)"
              }`,
            })}
          >
            <EventBusyRoundedIcon sx={{ fontSize: 38 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "text.primary" }}
          >
            No {statusFilter !== "All" ? statusFilter.toLowerCase() : ""}{" "}
            appointments
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: "0.875rem", mt: 1, mb: 3, lineHeight: 1.6 }}
          >
            {statusFilter === "Upcoming"
              ? "You do not have any upcoming visits booked. Check our top verified specialists and schedule an appointment in minutes."
              : statusFilter === "Completed"
                ? "You do not have any completed consultations in your history yet."
                : statusFilter === "Cancelled"
                  ? "No cancelled appointments recorded in your account."
                  : "No appointments match your filter. Book your first visit today."}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/doctors")}
            startIcon={<MedicalServicesRoundedIcon />}
            sx={{
              fontWeight: 700,
              borderRadius: "12px",
              px: 3,
              py: 1.25,
              boxShadow: 1,
              textTransform: "none",
            }}
          >
            Find a Doctor
          </Button>
        </Card>
      )}

      {/* Appointments List */}
      {!loading && !error && filteredAppointments.length > 0 && (
        <Stack spacing={3}>
          {filteredAppointments.map((app) => {
            const isCancelled = app.status === "Cancelled";
            const isCompleted = app.status === "Completed";
            const isUpcoming =
              app.status === "Upcoming" || (!isCancelled && !isCompleted);

            // Enrich doctor info via doctorsMap if available
            const docInfo = doctorsMap[String(app.doctorId)];
            const doctorAvatar = app.doctorAvatar || docInfo?.avatar || "";
            const doctorSpecialty =
              app.doctorSpecialty ||
              docInfo?.specialty ||
              "General Practitioner";

            return (
              <Card
                key={app.id}
                elevation={0}
                sx={(theme) => ({
                  bgcolor: "background.paper",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "16px",
                  p: { xs: 2.5, sm: 3 },
                  transition: "all 0.2s",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  },
                })}
              >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", lg: "row" },
                      alignItems: { lg: "center" },
                      justifyContent: "space-between",
                      gap: 2.5,
                    }}
                  >
                    {/* Left: Doctor Profile & Appointment Metadata */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      {/* Doctor Avatar */}
                      <Avatar
                        src={doctorAvatar}
                        alt={app.doctorName || "Doctor"}
                        sx={(theme) => ({
                          width: { xs: 64, sm: 72 },
                          height: { xs: 64, sm: 72 },
                          borderRadius: "16px",
                          border: `2px solid ${
                            theme.palette.mode === "dark"
                              ? "rgba(13, 148, 136, 0.4)"
                              : "rgba(13, 148, 136, 0.2)"
                          }`,
                          flexShrink: 0,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(30, 41, 59, 0.8)"
                              : "rgba(204, 251, 241, 0.5)",
                          color: "primary.main",
                          fontWeight: 700,
                        })}
                      >
                        {app.doctorName
                          ? app.doctorName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                          : "DR"}
                      </Avatar>

                      {/* Doctor & Patient Info */}
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, minWidth: 0 }}>
                        <Stack
                          direction="row"
                          sx={{ alignItems: "center", gap: 1.25, flexWrap: "wrap" }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 800,
                              color: "text.primary",
                              fontSize: { xs: "1rem", sm: "1.125rem" },
                              lineHeight: 1.2,
                            }}
                          >
                            {app.doctorName || "Specialist Consultation"}
                          </Typography>

                          {/* Status Badge */}
                          <Chip
                            label={app.status || "Upcoming"}
                            size="small"
                            sx={(theme) => ({
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              borderRadius: "8px",
                              px: 0.25,
                              ...(isCancelled
                                ? {
                                    bgcolor:
                                      theme.palette.mode === "dark"
                                        ? "rgba(239, 68, 68, 0.15)"
                                        : "rgba(239, 68, 68, 0.1)",
                                    color: theme.palette.error.main,
                                    border: `1px solid ${
                                      theme.palette.mode === "dark"
                                        ? "rgba(239, 68, 68, 0.3)"
                                        : "rgba(239, 68, 68, 0.2)"
                                    }`,
                                  }
                                : isCompleted
                                ? {
                                    bgcolor:
                                      theme.palette.mode === "dark"
                                        ? "rgba(59, 130, 246, 0.15)"
                                        : "rgba(59, 130, 246, 0.1)",
                                    color: theme.palette.info.main,
                                    border: `1px solid ${
                                      theme.palette.mode === "dark"
                                        ? "rgba(59, 130, 246, 0.3)"
                                        : "rgba(59, 130, 246, 0.2)"
                                    }`,
                                  }
                                : {
                                    bgcolor:
                                      theme.palette.mode === "dark"
                                        ? "rgba(13, 148, 136, 0.2)"
                                        : "rgba(13, 148, 136, 0.1)",
                                    color: theme.palette.primary.main,
                                    border: `1px solid ${
                                      theme.palette.mode === "dark"
                                        ? "rgba(13, 148, 136, 0.3)"
                                        : "rgba(13, 148, 136, 0.2)"
                                    }`,
                                  }),
                            })}
                          />

                          {/* Consultation Type Badge */}
                          <Chip
                            icon={
                              app.type === "Video Consultation" ? (
                                <VideocamRoundedIcon sx={{ fontSize: 16 }} />
                              ) : (
                                <LocalHospitalRoundedIcon
                                  sx={{ fontSize: 16 }}
                                />
                              )
                            }
                            label={app.type || "In-Clinic"}
                            size="small"
                            sx={(theme) => ({
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "rgba(51, 65, 85, 0.6)"
                                  : "rgba(241, 245, 249, 0.9)",
                              color: theme.palette.text.secondary,
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              borderRadius: "8px",
                            })}
                          />
                        </Stack>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "primary.main",
                            fontWeight: 600,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          {doctorSpecialty}
                        </Typography>

                        {/* Date & Time Slot Meta Badges */}
                        <Stack
                          direction="row"
                          sx={{
                            alignItems: "center",
                            gap: { xs: 1.5, sm: 2 },
                            fontSize: "0.75rem",
                            color: "text.secondary",
                            pt: 0.5,
                            flexWrap: "wrap",
                          }}
                        >
                          <Stack direction="row" sx={{ alignItems: "center", gap: 0.75 }}>
                            <CalendarMonthRoundedIcon
                              sx={{ fontSize: 16, color: "primary.main" }}
                            />
                            <Box component="span" sx={{ fontWeight: 500, color: "text.primary" }}>
                              {app.date}
                            </Box>
                          </Stack>

                          <Stack direction="row" sx={{ alignItems: "center", gap: 0.75 }}>
                            <AccessTimeRoundedIcon
                              sx={{ fontSize: 16, color: "primary.main" }}
                            />
                            <Box component="span" sx={{ fontWeight: 500, color: "text.primary" }}>
                              {app.timeSlot}
                            </Box>
                          </Stack>

                          {app.patientName && (
                            <Stack direction="row" sx={{ alignItems: "center", gap: 0.75 }}>
                              <PersonRoundedIcon
                                sx={{ fontSize: 16, color: "primary.main" }}
                              />
                              <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                                {app.patientName}
                              </Box>
                            </Stack>
                          )}
                        </Stack>

                        {/* Patient Contacts & Notes */}
                        {(app.phone || app.email || app.notes) && (
                          <Box sx={{ pt: 1, fontSize: "0.75rem", color: "text.secondary", display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <Stack
                              direction="row"
                              sx={{ alignItems: "center", gap: 1.5, flexWrap: "wrap" }}
                            >
                              {app.phone && (
                                <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                                  <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
                                  <span>{app.phone}</span>
                                </Stack>
                              )}
                              {app.email && (
                                <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                                  <EmailOutlinedIcon sx={{ fontSize: 14 }} />
                                  <span>{app.email}</span>
                                </Stack>
                              )}
                            </Stack>

                            {app.notes && (
                              <Stack direction="row" sx={{ alignItems: "flex-start", gap: 0.5, pt: 0.25 }}>
                                <NotesRoundedIcon
                                  sx={{
                                    fontSize: 14,
                                    mt: 0.2,
                                    color: "text.secondary",
                                  }}
                                />
                                <Box
                                  component="span"
                                  sx={{
                                    fontStyle: "italic",
                                    color: "text.secondary",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {app.notes}
                                </Box>
                              </Stack>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Right: Actions for active appointments */}
                    {isUpcoming && (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                          alignSelf: { xs: "flex-end", lg: "center" },
                          flexShrink: 0,
                          pt: { xs: 1, lg: 0 },
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditCalendarRoundedIcon />}
                          onClick={() => handleOpenReschedule(app)}
                          sx={(theme) => ({
                            borderRadius: "12px",
                            borderColor: theme.palette.divider,
                            color: "text.primary",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            px: 1.75,
                            py: 1,
                            textTransform: "none",
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "rgba(13, 148, 136, 0.15)"
                                  : "rgba(13, 148, 136, 0.08)",
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                            },
                          })}
                        >
                          Reschedule / Edit
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<CancelRoundedIcon />}
                          onClick={() => handleOpenCancel(app)}
                          sx={{
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            px: 1.75,
                            py: 1,
                            textTransform: "none",
                          }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* ========================================================= */}
      {/* Reschedule / Edit Modal Dialog */}
      {/* ========================================================= */}
      <Dialog
        open={rescheduleDialogOpen}
        onClose={() => !isUpdating && setRescheduleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: (theme) => ({
            borderRadius: "24px",
            p: { xs: 1, sm: 1.5 },
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
          }),
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "text.primary", pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Reschedule / Edit Appointment</span>
          <Chip
            label={selectedAppointment?.type || "In-Clinic"}
            size="small"
            sx={(theme) => ({
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(13, 148, 136, 0.2)"
                  : "rgba(13, 148, 136, 0.1)",
              color: "primary.main",
              fontWeight: 700,
              fontSize: "0.75rem",
            })}
          />
        </DialogTitle>

        <form onSubmit={handleConfirmReschedule}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <DialogContentText sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1 }}>
              Modify consultation timing with{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                {selectedAppointment?.doctorName}
              </Box>
              . Changes will take effect immediately.
            </DialogContentText>

            {/* Date Input */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "text.secondary",
                  mb: 1,
                }}
              >
                New Consultation Date *
              </Typography>
              <TextField
                fullWidth
                type="date"
                size="small"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                slotProps={{
                  htmlInput: { min: today },
                }}
                required
                sx={(theme) => ({
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: "background.paper",
                    "& fieldset": {
                      borderColor: theme.palette.divider,
                    },
                  },
                })}
              />
            </Box>

            {/* Time Slot Selection */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "text.secondary",
                  mb: 1,
                }}
              >
                Select Consultation Time Slot *
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" }, gap: 1 }}>
                {availableSlots.map((slot) => {
                  const isSelected = editSlot === slot;
                  return (
                    <Button
                      key={slot}
                      type="button"
                      variant={isSelected ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setEditSlot(slot)}
                      sx={(theme) => ({
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        py: 1,
                        textTransform: "none",
                        transition: "all 0.2s",
                        ...(isSelected
                          ? {
                              bgcolor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                            }
                          : {
                              borderColor: theme.palette.divider,
                              color: theme.palette.text.secondary,
                              bgcolor: "background.paper",
                              "&:hover": {
                                bgcolor:
                                  theme.palette.mode === "dark"
                                    ? "rgba(51, 65, 85, 0.5)"
                                    : "rgba(241, 245, 249, 0.8)",
                              },
                            }),
                      })}
                    >
                      {slot}
                    </Button>
                  );
                })}
              </Box>
            </Box>

            {/* Patient Notes */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "text.secondary",
                  mb: 1,
                }}
              >
                Patient Notes & Instructions (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Mention any symptoms or questions for the doctor..."
                size="small"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                sx={(theme) => ({
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: "background.paper",
                    "& fieldset": {
                      borderColor: theme.palette.divider,
                    },
                  },
                })}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2, pt: 1.5, gap: 1 }}>
            <Button
              type="button"
              onClick={() => setRescheduleDialogOpen(false)}
              disabled={isUpdating}
              sx={{ color: "text.secondary", fontWeight: 600, borderRadius: "12px", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isUpdating || !editDate || !editSlot}
              startIcon={
                isUpdating ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <EditCalendarRoundedIcon />
                )
              }
              sx={{ fontWeight: 700, borderRadius: "12px", px: 2.5, py: 1, boxShadow: 1, textTransform: "none" }}
            >
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ========================================================= */}
      {/* Cancel Confirmation Dialog Modal */}
      {/* ========================================================= */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => !isCancelling && setCancelDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: (theme) => ({
            borderRadius: "24px",
            p: 1.5,
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
          }),
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "text.primary", pb: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
          <CancelRoundedIcon sx={{ color: "error.main" }} />
          <span>Cancel Appointment?</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.875rem", color: "text.secondary", lineHeight: 1.6, pt: 0.5 }}>
            Are you sure you want to cancel your appointment with{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
              {appointmentToCancel?.doctorName}
            </Box>{" "}
            scheduled on{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
              {appointmentToCancel?.date}
            </Box>{" "}
            at{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
              {appointmentToCancel?.timeSlot}
            </Box>
            ?
          </DialogContentText>
          <Box
            sx={(theme) => ({
              mt: 1.5,
              p: 1.5,
              borderRadius: "12px",
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(239, 68, 68, 0.08)",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(239, 68, 68, 0.3)"
                  : "rgba(239, 68, 68, 0.2)"
              }`,
              fontSize: "0.75rem",
              color: theme.palette.error.main,
            })}
          >
            This action will permanently delete this booking from your active
            schedule.
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 1.5, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            disabled={isCancelling}
            sx={{ color: "text.secondary", fontWeight: 600, borderRadius: "12px", textTransform: "none" }}
          >
            Keep Visit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
            disabled={isCancelling}
            startIcon={
              isCancelling ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CancelRoundedIcon />
              )
            }
            sx={{ fontWeight: 700, borderRadius: "12px", px: 2, py: 1, boxShadow: 1, textTransform: "none" }}
          >
            {isCancelling ? "Cancelling..." : "Yes, Cancel Visit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================= */}
      {/* Feedback Toast / Snackbar */}
      {/* ========================================================= */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "0.875rem",
            boxShadow: 3,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
