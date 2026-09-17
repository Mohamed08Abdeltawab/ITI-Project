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
    <Box className="space-y-6 max-w-5xl mx-auto py-2 px-3 sm:px-4">
      {/* Top Header Banner */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        className="items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]"
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight"
          >
            My Appointments
          </Typography>
          <Typography
            variant="body2"
            className="text-[var(--text-secondary)] mt-1"
          >
            Manage upcoming consultations, reschedule your dates, or review past
            visit records.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => navigate("/doctors")}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-4 py-2.5 shadow-sm capitalize transition-all"
        >
          Book New Appointment
        </Button>
      </Stack>

      {/* Filter Tabs & Refresh Action */}
      <Stack
        direction="row"
        className="items-center justify-between gap-3 overflow-x-auto pb-1"
      >
        <Stack direction="row" spacing={1} className="shrink-0">
          {STATUS_TABS.map((status) => {
            const isActive = statusFilter === status;
            const count = counts[status] ?? 0;
            return (
              <Chip
                key={status}
                label={`${status} (${count})`}
                clickable
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl text-xs sm:text-sm font-semibold transition-all px-1.5 py-1 ${
                  isActive
                    ? "bg-teal-600 text-white shadow-xs font-bold"
                    : "bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-slate-50 dark:hover:bg-slate-700/60"
                }`}
              />
            );
          })}
        </Stack>

        <Tooltip title="Refresh appointments" arrow>
          <IconButton
            size="small"
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RefreshRoundedIcon
              fontSize="small"
              className={loading ? "animate-spin text-teal-600" : ""}
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
          className="rounded-2xl border border-red-200 dark:border-red-900/50"
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
              className="border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-2xl p-6"
            >
              <CardContent className="p-0">
                <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <Stack direction="row" spacing={2.5} className="items-center">
                    <Skeleton
                      variant="circular"
                      width={64}
                      height={64}
                      className="shrink-0"
                    />
                    <Box className="space-y-2 min-w-[200px]">
                      <Skeleton variant="text" width="70%" height={26} />
                      <Skeleton variant="text" width="45%" height={18} />
                      <Skeleton variant="text" width="90%" height={18} />
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1.5} className="self-end">
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={36}
                      className="rounded-xl"
                    />
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={36}
                      className="rounded-xl"
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
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto my-8 shadow-xs"
        >
          <Box className="w-18 h-18 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4 border border-teal-100 dark:border-teal-900/60 shadow-inner">
            <EventBusyRoundedIcon sx={{ fontSize: 38 }} />
          </Box>
          <Typography
            variant="h6"
            className="font-extrabold text-[var(--text-primary)]"
          >
            No {statusFilter !== "All" ? statusFilter.toLowerCase() : ""}{" "}
            appointments
          </Typography>
          <Typography
            variant="body2"
            className="text-[var(--text-secondary)] text-sm mt-1.5 mb-6 leading-relaxed"
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
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-6 py-2.5 shadow-sm capitalize"
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
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-teal-400/60 dark:hover:border-teal-500/60 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-xs hover:shadow-md group"
              >
                <CardContent className="p-0">
                  <Box className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Doctor Profile & Appointment Metadata */}
                    <Box className="flex items-start gap-4">
                      {/* Doctor Avatar */}
                      <Avatar
                        src={doctorAvatar}
                        alt={app.doctorName || "Doctor"}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 border-teal-500/20 shadow-xs shrink-0 bg-teal-50 dark:bg-slate-700 text-teal-700 font-bold"
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
                      <Box className="space-y-1.5 min-w-0">
                        <Stack
                          direction="row"
                          className="items-center gap-2.5 flex-wrap"
                        >
                          <Typography
                            variant="h6"
                            className="font-extrabold text-[var(--text-primary)] text-base sm:text-lg leading-tight"
                          >
                            {app.doctorName || "Specialist Consultation"}
                          </Typography>

                          {/* Status Badge */}
                          <Chip
                            label={app.status || "Upcoming"}
                            size="small"
                            className={`font-bold text-xs rounded-lg px-0.5 ${
                              isCancelled
                                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
                                : isCompleted
                                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60"
                                  : "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60"
                            }`}
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
                            className="bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg"
                          />
                        </Stack>

                        <Typography
                          variant="body2"
                          className="text-teal-600 dark:text-teal-400 font-semibold text-xs sm:text-sm"
                        >
                          {doctorSpecialty}
                        </Typography>

                        {/* Date & Time Slot Meta Badges */}
                        <Stack
                          direction="row"
                          className="items-center gap-3 sm:gap-4 text-xs text-[var(--text-secondary)] pt-1 flex-wrap"
                        >
                          <Stack
                            direction="row"
                            className="items-center gap-1.5"
                          >
                            <CalendarMonthRoundedIcon
                              sx={{ fontSize: 16, color: "#0d9488" }}
                            />
                            <span className="font-medium text-[var(--text-primary)]">
                              {app.date}
                            </span>
                          </Stack>

                          <Stack
                            direction="row"
                            className="items-center gap-1.5"
                          >
                            <AccessTimeRoundedIcon
                              sx={{ fontSize: 16, color: "#0d9488" }}
                            />
                            <span className="font-medium text-[var(--text-primary)]">
                              {app.timeSlot}
                            </span>
                          </Stack>

                          {app.patientName && (
                            <Stack
                              direction="row"
                              className="items-center gap-1.5"
                            >
                              <PersonRoundedIcon
                                sx={{ fontSize: 16, color: "#0d9488" }}
                              />
                              <span className="font-semibold text-[var(--text-primary)]">
                                {app.patientName}
                              </span>
                            </Stack>
                          )}
                        </Stack>

                        {/* Patient Contacts & Notes */}
                        {(app.phone || app.email || app.notes) && (
                          <Box className="pt-2 text-xs text-[var(--text-secondary)] space-y-1">
                            <Stack
                              direction="row"
                              className="items-center gap-3 flex-wrap"
                            >
                              {app.phone && (
                                <Stack
                                  direction="row"
                                  className="items-center gap-1"
                                >
                                  <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
                                  <span>{app.phone}</span>
                                </Stack>
                              )}
                              {app.email && (
                                <Stack
                                  direction="row"
                                  className="items-center gap-1"
                                >
                                  <EmailOutlinedIcon sx={{ fontSize: 14 }} />
                                  <span>{app.email}</span>
                                </Stack>
                              )}
                            </Stack>

                            {app.notes && (
                              <Stack
                                direction="row"
                                className="items-start gap-1 pt-0.5"
                              >
                                <NotesRoundedIcon
                                  sx={{
                                    fontSize: 14,
                                    mt: 0.2,
                                    color: "#94a3b8",
                                  }}
                                />
                                <span className="italic text-[var(--text-secondary)] line-clamp-2">
                                  {app.notes}
                                </span>
                              </Stack>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Right: Actions for active appointments */}
                    {isUpcoming && (
                      <Stack
                        direction={{ xs: "row", sm: "row" }}
                        spacing={1.5}
                        className="self-end lg:self-center shrink-0 pt-2 lg:pt-0"
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditCalendarRoundedIcon />}
                          onClick={() => handleOpenReschedule(app)}
                          className="rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:border-teal-300 hover:text-teal-700 dark:hover:text-teal-300 text-xs font-bold px-3.5 py-2 capitalize transition-all"
                        >
                          Reschedule / Edit
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<CancelRoundedIcon />}
                          onClick={() => handleOpenCancel(app)}
                          className="rounded-xl border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold px-3.5 py-2 capitalize transition-all"
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
          sx: {
            borderRadius: "24px",
            p: { xs: 1, sm: 1.5 },
            bgcolor: "background.paper",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle className="font-extrabold text-[var(--text-primary)] pb-2 flex items-center justify-between">
          <span>Reschedule / Edit Appointment</span>
          <Chip
            label={selectedAppointment?.type || "In-Clinic"}
            size="small"
            className="bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-bold text-xs"
          />
        </DialogTitle>

        <form onSubmit={handleConfirmReschedule}>
          <DialogContent className="space-y-4 pt-1">
            <DialogContentText className="text-sm text-[var(--text-secondary)] mb-3">
              Modify consultation timing with{" "}
              <span className="font-bold text-[var(--text-primary)]">
                {selectedAppointment?.doctorName}
              </span>
              . Changes will take effect immediately.
            </DialogContentText>

            {/* Date Input */}
            <Box>
              <Typography
                variant="caption"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5"
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                  },
                }}
              />
            </Box>

            {/* Time Slot Selection */}
            <Box>
              <Typography
                variant="caption"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2"
              >
                Select Consultation Time Slot *
              </Typography>
              <Box className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = editSlot === slot;
                  return (
                    <Button
                      key={slot}
                      type="button"
                      variant={isSelected ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setEditSlot(slot)}
                      className={`rounded-xl text-xs font-bold py-2 capitalize transition-all ${
                        isSelected
                          ? "bg-teal-600 text-white shadow-xs"
                          : "border border-[var(--border-color)] text-[var(--text-secondary)] bg-[var(--bg-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
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
                className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5"
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                  },
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions className="px-6 pb-4 pt-3 gap-2">
            <Button
              type="button"
              onClick={() => setRescheduleDialogOpen(false)}
              disabled={isUpdating}
              className="text-[var(--text-secondary)] font-semibold rounded-xl capitalize"
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
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-5 py-2 shadow-xs capitalize"
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
          sx: {
            borderRadius: "24px",
            p: 1.5,
            bgcolor: "background.paper",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle className="font-extrabold text-[var(--text-primary)] pb-1 flex items-center gap-2">
          <CancelRoundedIcon className="text-rose-600" />
          <span>Cancel Appointment?</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
            Are you sure you want to cancel your appointment with{" "}
            <span className="font-bold text-[var(--text-primary)]">
              {appointmentToCancel?.doctorName}
            </span>{" "}
            scheduled on{" "}
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {appointmentToCancel?.date}
            </span>{" "}
            at{" "}
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {appointmentToCancel?.timeSlot}
            </span>
            ?
          </DialogContentText>
          <Box className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300">
            This action will permanently delete this booking from your active
            schedule.
          </Box>
        </DialogContent>
        <DialogActions className="px-6 pb-3 pt-2 gap-2">
          <Button
            onClick={() => setCancelDialogOpen(false)}
            disabled={isCancelling}
            className="text-[var(--text-secondary)] font-semibold rounded-xl capitalize"
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
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl px-4 py-2 shadow-xs capitalize"
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
          className="rounded-xl font-semibold shadow-lg text-sm"
          sx={{
            bgcolor:
              snackbar.severity === "success"
                ? "#0d9488"
                : snackbar.severity === "error"
                  ? "#dc2626"
                  : "#334155",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
