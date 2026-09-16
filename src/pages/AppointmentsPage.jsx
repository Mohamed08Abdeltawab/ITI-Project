import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Skeleton,
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
import {
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "../services/api";

const RESCHEDULE_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "11:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:00 PM",
];

export default function AppointmentsPage() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  // Reschedule Modal state
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState("");
  const [rescheduleNotes, setRescheduleNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Cancel Confirmation Dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Snackbar Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const today = new Date().toISOString().split("T")[0];

  const fetchAppointmentsList = () => {
    getAppointments()
      .then((res) => {
        setAppointments(Array.isArray(res.data) ? res.data : []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load appointments list.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppointmentsList();
  }, []);

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === "All") return true;
    return app.status === statusFilter;
  });

  // Open Reschedule modal
  const handleOpenReschedule = (app) => {
    setSelectedAppointment(app);
    setRescheduleDate(app.date || today);
    setRescheduleSlot(app.timeSlot || RESCHEDULE_SLOTS[0]);
    setRescheduleNotes(app.notes || "");
    setRescheduleDialogOpen(true);
  };

  // Submit Reschedule update
  const handleConfirmReschedule = async () => {
    if (!selectedAppointment) return;
    setIsUpdating(true);
    try {
      await updateAppointment(selectedAppointment.id, {
        date: rescheduleDate,
        timeSlot: rescheduleSlot,
        notes: rescheduleNotes,
        status: "Upcoming",
      });
      setSnackbar({
        open: true,
        message: "Appointment rescheduled successfully!",
        severity: "success",
      });
      setRescheduleDialogOpen(false);
      fetchAppointmentsList();
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to reschedule appointment. Please try again.",
        severity: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Cancel dialog
  const handleOpenCancel = (app) => {
    setAppointmentToCancel(app);
    setCancelDialogOpen(true);
  };

  // Confirm Cancel
  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) return;
    setIsCancelling(true);
    try {
      // Option: update status to Cancelled rather than hard delete, or hard delete
      await updateAppointment(appointmentToCancel.id, {
        status: "Cancelled",
      });
      setSnackbar({
        open: true,
        message: "Appointment cancelled successfully.",
        severity: "info",
      });
      setCancelDialogOpen(false);
      fetchAppointmentsList();
    } catch {
      // Fallback if patch fails, try delete
      try {
        await deleteAppointment(appointmentToCancel.id);
        setSnackbar({
          open: true,
          message: "Appointment removed.",
          severity: "info",
        });
        setCancelDialogOpen(false);
        fetchAppointmentsList();
      } catch {
        setSnackbar({
          open: true,
          message: "Could not cancel appointment. Please try again.",
          severity: "error",
        });
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const statusCounts = {
    All: appointments.length,
    Upcoming: appointments.filter((a) => a.status === "Upcoming").length,
    Completed: appointments.filter((a) => a.status === "Completed").length,
    Cancelled: appointments.filter((a) => a.status === "Cancelled").length,
  };

  return (
    <Box className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header Banner */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        className="items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800"
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            My Appointments
          </Typography>
          <Typography
            variant="body2"
            className="text-slate-500 dark:text-slate-400 mt-1"
          >
            Manage your booked medical visits, reschedule dates, or view
            consultation details.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => navigate("/doctors")}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-4 py-2.5 shadow-xs"
        >
          Book New Visit
        </Button>
      </Stack>

      {/* Filter Tabs */}
      <Stack direction="row" spacing={1.5} className="overflow-x-auto pb-1">
        {["All", "Upcoming", "Completed", "Cancelled"].map((status) => {
          const isActive = statusFilter === status;
          return (
            <Chip
              key={status}
              label={`${status} (${statusCounts[status] || 0})`}
              clickable
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl text-xs sm:text-sm font-semibold transition-all px-1 py-1 ${
                isActive
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
              }`}
            />
          );
        })}
      </Stack>

      {/* Error state */}
      {error && (
        <Alert severity="error" className="rounded-2xl">
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
              className="border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 rounded-2xl p-6"
            >
              <CardContent className="p-0 space-y-3">
                <Skeleton variant="text" width="40%" height={28} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton
                  variant="rectangular"
                  height={50}
                  className="rounded-xl"
                />
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAppointments.length === 0 && (
        <Card
          elevation={0}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto my-8"
        >
          <Box className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4">
            <CalendarMonthRoundedIcon sx={{ fontSize: 34 }} />
          </Box>
          <Typography
            variant="h6"
            className="font-bold text-slate-800 dark:text-white"
          >
            No appointments found
          </Typography>
          <Typography
            variant="body2"
            className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 mb-6"
          >
            {statusFilter === "All"
              ? "You don't have any scheduled appointments yet. Find a trusted doctor to book your visit."
              : `You have no ${statusFilter.toLowerCase()} appointments at this time.`}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/doctors")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-6 py-2.5 shadow-xs"
          >
            Browse Specialists
          </Button>
        </Card>
      )}

      {/* Appointments List */}
      {!loading && !error && filteredAppointments.length > 0 && (
        <Stack spacing={3}>
          {filteredAppointments.map((app) => {
            const isCancelled = app.status === "Cancelled";
            const isCompleted = app.status === "Completed";
            return (
              <Card
                key={app.id}
                elevation={0}
                className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/90 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <Box className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Main Info */}
                    <Box className="space-y-2">
                      <Stack
                        direction="row"
                        className="items-center gap-2.5 flex-wrap"
                      >
                        <Typography
                          variant="h6"
                          className="font-bold text-slate-900 dark:text-white leading-tight"
                        >
                          {app.doctorName || "Specialist Consultation"}
                        </Typography>

                        {/* Status Chip */}
                        <Chip
                          label={app.status || "Upcoming"}
                          size="small"
                          className={`font-bold text-xs rounded-lg ${
                            isCancelled
                              ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60"
                              : isCompleted
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                                : "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60"
                          }`}
                        />

                        {/* Consultation Type Chip */}
                        <Chip
                          icon={
                            app.type === "Video Consultation" ? (
                              <VideocamRoundedIcon sx={{ fontSize: 16 }} />
                            ) : (
                              <LocalHospitalRoundedIcon sx={{ fontSize: 16 }} />
                            )
                          }
                          label={app.type || "In-Clinic"}
                          size="small"
                          className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg"
                        />
                      </Stack>

                      {/* Patient & Date Meta */}
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        className="items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-1"
                      >
                        <Stack direction="row" className="items-center gap-1.5">
                          <PersonRoundedIcon
                            sx={{ fontSize: 16, color: "#0d9488" }}
                          />
                          <Typography
                            variant="caption"
                            className="text-slate-700 dark:text-slate-300 font-semibold text-xs"
                          >
                            {app.patientName}
                          </Typography>
                        </Stack>

                        <Stack direction="row" className="items-center gap-1.5">
                          <CalendarMonthRoundedIcon
                            sx={{ fontSize: 16, color: "#0d9488" }}
                          />
                          <Typography
                            variant="caption"
                            className="text-slate-700 dark:text-slate-300 font-medium text-xs"
                          >
                            {app.date}
                          </Typography>
                        </Stack>

                        <Stack direction="row" className="items-center gap-1.5">
                          <AccessTimeRoundedIcon
                            sx={{ fontSize: 16, color: "#0d9488" }}
                          />
                          <Typography
                            variant="caption"
                            className="text-slate-700 dark:text-slate-300 font-medium text-xs"
                          >
                            {app.timeSlot}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Contact & Notes Snippet */}
                      {(app.phone || app.email || app.notes) && (
                        <Box className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
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
                            <Typography
                              variant="caption"
                              className="text-slate-600 dark:text-slate-400 italic block mt-1 line-clamp-1"
                            >
                              Note: {app.notes}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    {!isCancelled && !isCompleted && (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        className="self-end lg:self-center shrink-0"
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditCalendarRoundedIcon />}
                          onClick={() => handleOpenReschedule(app)}
                          className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold px-3 py-1.5"
                        >
                          Reschedule
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<CancelRoundedIcon />}
                          onClick={() => handleOpenCancel(app)}
                          className="rounded-xl border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold px-3 py-1.5"
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

      {/* Reschedule Dialog Modal */}
      <Dialog
        open={rescheduleDialogOpen}
        onClose={() => !isUpdating && setRescheduleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "20px", p: 1, bgcolor: "background.paper" },
        }}
      >
        <DialogTitle className="font-extrabold text-slate-900 dark:text-white pb-2">
          Reschedule Appointment
        </DialogTitle>
        <DialogContent className="space-y-4 pt-3">
          <DialogContentText className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            Change your date and preferred consultation time slot for{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {selectedAppointment?.doctorName}
            </span>
            .
          </DialogContentText>

          <TextField
            fullWidth
            type="date"
            label="New Appointment Date"
            size="small"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: today }}
            value={rescheduleDate}
            onChange={(e) => setRescheduleDate(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "background.paper",
              },
            }}
          />

          <Box>
            <Typography
              variant="caption"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
            >
              Select New Time Slot *
            </Typography>
            <Box className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RESCHEDULE_SLOTS.map((slot) => {
                const isSelected = rescheduleSlot === slot;
                return (
                  <Button
                    key={slot}
                    variant={isSelected ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setRescheduleSlot(slot)}
                    className={`rounded-xl text-xs font-semibold py-1.5 ${
                      isSelected
                        ? "bg-teal-600 text-white shadow-xs"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {slot}
                  </Button>
                );
              })}
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Update Notes (Optional)"
            size="small"
            value={rescheduleNotes}
            onChange={(e) => setRescheduleNotes(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "background.paper",
              },
            }}
          />
        </DialogContent>
        <DialogActions className="px-6 pb-4 pt-2">
          <Button
            onClick={() => setRescheduleDialogOpen(false)}
            disabled={isUpdating}
            className="text-slate-600 dark:text-slate-400 font-semibold"
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmReschedule}
            disabled={isUpdating || !rescheduleDate || !rescheduleSlot}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-5"
          >
            {isUpdating ? "Saving..." : "Confirm Reschedule"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => !isCancelling && setCancelDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "20px", p: 1, bgcolor: "background.paper" },
        }}
      >
        <DialogTitle className="font-extrabold text-slate-900 dark:text-white pb-1">
          Cancel Appointment?
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to cancel your consultation with{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {appointmentToCancel?.doctorName}
            </span>{" "}
            on {appointmentToCancel?.date} at {appointmentToCancel?.timeSlot}?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button
            onClick={() => setCancelDialogOpen(false)}
            disabled={isCancelling}
            className="text-slate-600 dark:text-slate-400 font-semibold"
          >
            Keep Appointment
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
            disabled={isCancelling}
            className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-4"
          >
            {isCancelling ? "Cancelling..." : "Yes, Cancel Visit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          className="rounded-xl font-semibold shadow-md text-sm"
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
