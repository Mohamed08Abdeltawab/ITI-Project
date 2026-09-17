import { useState, useEffect, useId } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Stack,
  Typography,
  Card,
  TextField,
  Button,
  Chip,
  Avatar,
  Badge,
  Alert,
  Snackbar,
  MenuItem,
  CircularProgress,
  FormControl,
  FormHelperText,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import { getDoctorById, getDoctors, createAppointment } from "../services/api";

const DEFAULT_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "11:45 AM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
];

function generateAppointmentPayload(formData, selectedDoctor) {
  return {
    id: Date.now().toString(),
    doctorId: selectedDoctor?.id || formData.doctorId,
    doctorName: selectedDoctor?.name || "Specialist",
    patientName: formData.patientName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    date: formData.date,
    timeSlot: formData.timeSlot,
    type: formData.type,
    notes: formData.notes ? formData.notes.trim() : "",
    status: "Upcoming",
    createdAt: new Date().toISOString(),
  };
}

export default function BookAppointmentPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Notification feedback state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Min selectable date = today
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      doctorId: doctorId || "",
      patientName: "",
      email: "",
      phone: "",
      date: "",
      timeSlot: "",
      type: "In-Clinic",
      notes: "",
    },
  });

  // Load doctors on mount
  useEffect(() => {
    let isMounted = true;
    getDoctors()
      .then((res) => {
        if (!isMounted) return;
        const docs = Array.isArray(res.data) ? res.data : [];
        setDoctorsList(docs);

        if (doctorId) {
          const matched = docs.find((d) => String(d.id) === String(doctorId));
          if (matched) {
            setSelectedDoctor(matched);
            setValue("doctorId", String(matched.id));
          } else {
            getDoctorById(doctorId)
              .then((singleRes) => {
                if (!isMounted) return;
                setSelectedDoctor(singleRes.data);
                setValue("doctorId", String(singleRes.data.id));
              })
              .catch(() => {
                if (!isMounted) return;
                setFetchError("Doctor not found with the provided ID.");
              });
          }
        } else if (docs.length > 0) {
          setSelectedDoctor(docs[0]);
          setValue("doctorId", String(docs[0].id));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setFetchError("Failed to load doctor details. Please try again.");
      })
      .finally(() => {
        if (isMounted) setLoadingDoctor(false);
      });

    return () => {
      isMounted = false;
    };
  }, [doctorId, setValue]);

  // Handle manual doctor selection from dropdown
  const handleDoctorChange = (e) => {
    const newId = e.target.value;
    setValue("doctorId", newId);
    const doctor = doctorsList.find((d) => String(d.id) === String(newId));
    setSelectedDoctor(doctor || null);
    setValue("timeSlot", "");
  };

  const availableSlots =
    selectedDoctor?.slots && selectedDoctor.slots.length > 0
      ? selectedDoctor.slots
      : DEFAULT_SLOTS;

  const onSubmit = async (formData) => {
    setSubmitError(null);
    try {
      const payload = generateAppointmentPayload(formData, selectedDoctor);
      await createAppointment(payload);
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate("/appointments");
      }, 1500);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Failed to book appointment. Please try again.",
      );
    }
  };

  const doctorSelectId = useId();

  return (
    <Box className="min-h-screen py-4 sm:py-6 px-2 sm:px-4 flex flex-col items-center">
      {/* Top Header / Back Navigation */}
      <Stack
        direction="row"
        className="w-full max-w-2xl mb-5 items-center justify-between"
      >
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/doctors")}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-sm rounded-xl py-2 px-3"
        >
          Back to Doctors
        </Button>

        <Chip
          label="Step 2 of 2: Appointment Details"
          size="small"
          className="bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-bold border border-teal-200/70 dark:border-teal-800/70 text-xs"
        />
      </Stack>

      {/* Main Form Card */}
      <Card
        elevation={0}
        className="w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-sm p-6 sm:p-8 md:p-10"
      >
        {/* Title Header */}
        <Box className="mb-6">
          <Typography
            variant="h4"
            component="h1"
            className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight"
          >
            Book an Appointment
          </Typography>
          <Typography
            variant="body2"
            className="text-[var(--text-secondary)] mt-1"
          >
            Complete the form below to secure your consultation slot with
            CarePoint.
          </Typography>
        </Box>

        {fetchError && (
          <Alert severity="error" className="mb-6 rounded-2xl">
            {fetchError}
          </Alert>
        )}

        {/* Doctor Summary Section / Doctor Selector */}
        {loadingDoctor ? (
          <Box className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-[var(--border-color)] mb-6">
            <CircularProgress size={26} className="text-teal-600" />
            <Typography
              variant="body2"
              className="ml-3 text-[var(--text-secondary)] font-medium"
            >
              Loading doctor information...
            </Typography>
          </Box>
        ) : (
          <Box className="mb-8">
            {/* If no doctorId was in URL, allow picking doctor */}
            {!doctorId && doctorsList.length > 0 && (
              <Box className="mb-4">
                <Typography
                  variant="caption"
                  component="label"
                  htmlFor={doctorSelectId}
                  className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
                >
                  Select Doctor *
                </Typography>
                <TextField
                  id={doctorSelectId}
                  select
                  fullWidth
                  size="small"
                  value={selectedDoctor?.id ? String(selectedDoctor.id) : ""}
                  onChange={handleDoctorChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      bgcolor: "background.paper",
                    },
                  }}
                >
                  {doctorsList.map((doc) => (
                    <MenuItem key={doc.id} value={String(doc.id)}>
                      {doc.name} — {doc.specialty}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}

            {/* Doctor Compact Summary Card */}
            {selectedDoctor && (
              <Box className="bg-gradient-to-br from-teal-50/50 via-slate-50/60 to-white dark:from-slate-800 dark:via-slate-850 dark:to-teal-950/30 border border-teal-100/80 dark:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Stack direction="row" className="items-center gap-3.5">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#10b981",
                        color: "#10b981",
                        boxShadow: "0 0 0 2px #ffffff",
                        width: 10,
                        height: 10,
                      },
                    }}
                  >
                    <Avatar
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      variant="rounded"
                      className="w-14 h-14 rounded-2xl object-cover bg-slate-100 dark:bg-slate-700"
                    />
                  </Badge>

                  <Box>
                    <Stack direction="row" className="items-center gap-2">
                      <Typography
                        variant="subtitle1"
                        className="font-bold text-[var(--text-primary)] leading-tight"
                      >
                        {selectedDoctor.name}
                      </Typography>
                      {doctorId && doctorsList.length > 1 && (
                        <Button
                          size="small"
                          onClick={() => navigate("/book")}
                          className="text-xs text-teal-600 dark:text-teal-400 p-0 min-w-0 font-semibold"
                        >
                          (Change)
                        </Button>
                      )}
                    </Stack>

                    <Stack
                      direction="row"
                      className="items-center gap-2 mt-1 flex-wrap"
                    >
                      <Chip
                        label={selectedDoctor.specialty}
                        size="small"
                        className="bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 font-semibold text-xs h-6 rounded-md"
                      />
                      <Typography
                        variant="caption"
                        className="text-slate-500 dark:text-slate-400 font-medium text-xs"
                      >
                        {selectedDoctor.experience || "10 yrs exp"}
                      </Typography>
                      <Stack
                        direction="row"
                        className="items-center gap-0.5 text-xs text-amber-500 font-semibold"
                      >
                        <StarRoundedIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" className="font-bold">
                          {selectedDoctor.rating || 4.9}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>

                <Box className="sm:text-right bg-white/90 dark:bg-slate-800/90 border border-slate-150 dark:border-slate-700 px-3.5 py-2 rounded-xl shrink-0 w-full sm:w-auto">
                  <Typography
                    variant="caption"
                    className="block text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider"
                  >
                    Consultation Fee
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="font-extrabold text-teal-600 dark:text-teal-400 leading-tight"
                  >
                    {selectedDoctor.fee || "$120"}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
                      / visit
                    </span>
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Booking Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {submitError && (
            <Alert severity="error" className="mb-4 rounded-2xl">
              {submitError}
            </Alert>
          )}

          {/* Patient Details */}
          <Box className="mb-6">
            <Stack direction="row" className="items-center gap-2 mb-3">
              <PersonOutlineRoundedIcon
                sx={{ fontSize: 18, color: "#0d9488" }}
              />
              <Typography
                variant="subtitle2"
                className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]"
              >
                Patient Information
              </Typography>
            </Stack>

            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Patient Full Name"
                placeholder="Enter patient full name"
                variant="outlined"
                size="small"
                {...register("patientName", {
                  required: "Patient name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                error={Boolean(errors.patientName)}
                helperText={errors.patientName?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: "background.paper",
                  },
                }}
              />

              <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  label="Email Address"
                  placeholder="patient@example.com"
                  variant="outlined"
                  size="small"
                  type="email"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <EmailOutlinedIcon
                          sx={{ fontSize: 18, color: "#94a3b8", mr: 1 }}
                        />
                      ),
                    },
                  }}
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      bgcolor: "background.paper",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="e.g. 01012345678"
                  variant="outlined"
                  size="small"
                  type="tel"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <PhoneOutlinedIcon
                          sx={{ fontSize: 18, color: "#94a3b8", mr: 1 }}
                        />
                      ),
                    },
                  }}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9+\s()-]{8,20}$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      bgcolor: "background.paper",
                    },
                  }}
                />
              </Box>
            </Stack>
          </Box>

          {/* Consultation Type Selector */}
          <Box className="mb-6">
            <Typography
              variant="caption"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5"
            >
              Consultation Mode *
            </Typography>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: In-Clinic */}
                  <Card
                    elevation={0}
                    onClick={() => field.onChange("In-Clinic")}
                    className={`cursor-pointer border rounded-2xl p-4 transition-all flex items-start justify-between ${
                      field.value === "In-Clinic"
                        ? "border-teal-600 dark:border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 shadow-xs"
                        : "border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-slate-50 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    <Stack direction="row" className="items-start gap-3">
                      <Box
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          field.value === "In-Clinic"
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <LocalHospitalRoundedIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          className="font-bold text-[var(--text-primary)] leading-tight"
                        >
                          In-Clinic Visit
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-slate-500 dark:text-slate-400 block mt-0.5 text-xs"
                        >
                          Direct consultation at medical center
                        </Typography>
                      </Box>
                    </Stack>
                    {field.value === "In-Clinic" && (
                      <CheckCircleRoundedIcon
                        sx={{ fontSize: 20, color: "#0d9488" }}
                      />
                    )}
                  </Card>

                  {/* Option 2: Video Consultation */}
                  <Card
                    elevation={0}
                    onClick={() => field.onChange("Video Consultation")}
                    className={`cursor-pointer border rounded-2xl p-4 transition-all flex items-start justify-between ${
                      field.value === "Video Consultation"
                        ? "border-teal-600 dark:border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 shadow-xs"
                        : "border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-slate-50 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    <Stack direction="row" className="items-start gap-3">
                      <Box
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          field.value === "Video Consultation"
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <VideocamRoundedIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          className="font-bold text-[var(--text-primary)] leading-tight"
                        >
                          Video Call
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-slate-500 dark:text-slate-400 block mt-0.5 text-xs"
                        >
                          Secure online telehealth consultation
                        </Typography>
                      </Box>
                    </Stack>
                    {field.value === "Video Consultation" && (
                      <CheckCircleRoundedIcon
                        sx={{ fontSize: 20, color: "#0d9488" }}
                      />
                    )}
                  </Card>
                </Box>
              )}
            />
          </Box>

          {/* Date & Time Slot Section */}
          <Box className="mb-6 space-y-4">
            <Stack direction="row" className="items-center gap-2 mb-1">
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 18, color: "#0d9488" }}
              />
              <Typography
                variant="subtitle2"
                className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]"
              >
                Date &amp; Schedule
              </Typography>
            </Stack>

            <TextField
              fullWidth
              type="date"
              label="Appointment Date"
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: today },
              }}
              {...register("date", {
                required: "Appointment date is required",
              })}
              error={Boolean(errors.date)}
              helperText={errors.date?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  bgcolor: "background.paper",
                },
              }}
            />

            {/* Selectable Time Slots */}
            <FormControl fullWidth error={Boolean(errors.timeSlot)}>
              <Controller
                name="timeSlot"
                control={control}
                rules={{ required: "Please select an available time slot" }}
                render={({ field }) => (
                  <Box>
                    <Stack
                      direction="row"
                      className="items-center justify-between mb-2"
                    >
                      <Typography
                        variant="caption"
                        className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5"
                      >
                        <AccessTimeRoundedIcon
                          sx={{ fontSize: 15, color: "#0d9488" }}
                        />
                        Select Time Slot *
                      </Typography>
                      {field.value && (
                        <Typography
                          variant="caption"
                          className="text-xs text-teal-700 dark:text-teal-300 font-bold"
                        >
                          Selected: {field.value}
                        </Typography>
                      )}
                    </Stack>

                    <Box className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                      {availableSlots.map((slot) => {
                        const isSelected = field.value === slot;
                        return (
                          <Button
                            key={slot}
                            variant={isSelected ? "contained" : "outlined"}
                            onClick={() => field.onChange(slot)}
                            startIcon={
                              <AccessTimeRoundedIcon
                                sx={{
                                  fontSize: 15,
                                  color: isSelected ? "#ffffff" : "#94a3b8",
                                }}
                              />
                            }
                            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                              isSelected
                                ? "bg-teal-600 text-white shadow-xs"
                                : "border border-[var(--border-color)] text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-teal-300"
                            }`}
                          >
                            {slot}
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              />
              {errors.timeSlot && (
                <FormHelperText className="text-red-600 text-xs mt-1.5">
                  {errors.timeSlot.message}
                </FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Notes Section */}
          <Box className="mb-8">
            <Stack direction="row" className="items-center gap-2 mb-2">
              <NotesRoundedIcon sx={{ fontSize: 18, color: "#0d9488" }} />
              <Typography
                variant="caption"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Symptoms / Medical Notes (Optional)
              </Typography>
            </Stack>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Describe your current symptoms, medical history, or specific questions for the doctor..."
              variant="outlined"
              size="small"
              {...register("notes")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  bgcolor: "background.paper",
                },
              }}
            />
          </Box>

          {/* Form Actions */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            className="pt-4 border-t border-[var(--border-color)]"
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/doctors")}
              disabled={isSubmitting}
              className="w-full sm:w-1/3 py-3 rounded-xl font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel / Back
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || loadingDoctor || !selectedDoctor}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={18} sx={{ color: "#ffffff" }} />
                ) : (
                  <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
                )
              }
              className="w-full sm:w-2/3 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-all disabled:opacity-60"
            >
              {isSubmitting
                ? "Confirming Booking..."
                : "Confirm & Book Appointment"}
            </Button>
          </Stack>
        </Box>
      </Card>

      {/* Booking Success Feedback Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          className="rounded-xl font-semibold text-sm shadow-lg"
          sx={{ bgcolor: "#0d9488" }}
        >
          Appointment confirmed! Redirecting to your appointments...
        </Alert>
      </Snackbar>
    </Box>
  );
}
