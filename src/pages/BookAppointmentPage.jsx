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
import { useAppointmentsStore } from "../stores/useAppointmentsStore";

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
      const res = await createAppointment(payload);
      useAppointmentsStore.getState().addAppointment(res?.data || payload);
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
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 2, sm: 3 },
        px: { xs: 1, sm: 2 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Header / Back Navigation */}
      <Stack
        direction="row"
        sx={{
          width: "100%",
          maxWidth: 672,
          mb: 2.5,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
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
          Back to Doctors
        </Button>

        <Chip
          label="Step 2 of 2: Appointment Details"
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

      {/* Main Form Card */}
      <Card
        elevation={0}
        sx={(theme) => ({
          width: "100%",
          maxWidth: 672,
          bgcolor: "background.paper",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "24px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          p: { xs: 3, sm: 4, md: 5 },
        })}
      >
        {/* Title Header */}
        <Box sx={{ mb: 3 }}>
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
            Book an Appointment
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Complete the form below to secure your consultation slot with
            CarePoint.
          </Typography>
        </Box>

        {fetchError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "16px" }}>
            {fetchError}
          </Alert>
        )}

        {/* Doctor Summary Section / Doctor Selector */}
        {loadingDoctor ? (
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(30, 41, 59, 0.5)"
                  : "rgba(241, 245, 249, 0.6)",
              borderRadius: "16px",
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            })}
          >
            <CircularProgress size={26} color="primary" />
            <Typography
              variant="body2"
              sx={{ ml: 1.5, color: "text.secondary", fontWeight: 500 }}
            >
              Loading doctor information...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mb: 4 }}>
            {/* If no doctorId was in URL, allow picking doctor */}
            {!doctorId && doctorsList.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  component="label"
                  htmlFor={doctorSelectId}
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
                  Select Doctor *
                </Typography>
                <TextField
                  id={doctorSelectId}
                  select
                  fullWidth
                  size="small"
                  value={selectedDoctor?.id ? String(selectedDoctor.id) : ""}
                  onChange={handleDoctorChange}
                  sx={(theme) => ({
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      bgcolor: "background.paper",
                      "& fieldset": {
                        borderColor: theme.palette.divider,
                      },
                    },
                  })}
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
              <Box
                sx={(theme) => ({
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(13, 148, 136, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(204, 251, 241, 0.3) 0%, rgba(248, 250, 252, 0.6) 100%)",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "16px",
                  p: { xs: 2, sm: 2.5 },
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                })}
              >
                <Stack direction="row" sx={{ alignItems: "center", gap: 1.75 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    sx={(theme) => ({
                      "& .MuiBadge-badge": {
                        backgroundColor: theme.palette.success.main,
                        color: theme.palette.success.main,
                        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                        width: 10,
                        height: 10,
                      },
                    })}
                  >
                    <Avatar
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      variant="rounded"
                      sx={(theme) => ({
                        width: 56,
                        height: 56,
                        borderRadius: "16px",
                        objectFit: "cover",
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "slate.700"
                            : "grey.100",
                      })}
                    />
                  </Badge>

                  <Box>
                    <Stack
                      direction="row"
                      sx={{ alignItems: "center", gap: 1 }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          lineHeight: 1.2,
                        }}
                      >
                        {selectedDoctor.name}
                      </Typography>
                      {doctorId && doctorsList.length > 1 && (
                        <Button
                          size="small"
                          onClick={() => navigate("/book")}
                          sx={{
                            fontSize: "0.75rem",
                            color: "primary.main",
                            p: 0,
                            minWidth: 0,
                            fontWeight: 600,
                          }}
                        >
                          (Change)
                        </Button>
                      )}
                    </Stack>

                    <Stack
                      direction="row"
                      sx={{
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        label={selectedDoctor.specialty}
                        size="small"
                        sx={(theme) => ({
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(13, 148, 136, 0.2)"
                              : "rgba(13, 148, 136, 0.08)",
                          color: theme.palette.primary.main,
                          border: `1px solid ${
                            theme.palette.mode === "dark"
                              ? "rgba(13, 148, 136, 0.3)"
                              : "rgba(13, 148, 136, 0.2)"
                          }`,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                          borderRadius: "6px",
                        })}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      >
                        {selectedDoctor.experience || "10 yrs exp"}
                      </Typography>
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          gap: 0.25,
                          fontSize: "0.75rem",
                          color: "warning.main",
                          fontWeight: 600,
                        }}
                      >
                        <StarRoundedIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {selectedDoctor.rating || 4.9}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>

                <Box
                  sx={(theme) => ({
                    textAlign: { sm: "right" },
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(30, 41, 59, 0.8)"
                        : "rgba(255, 255, 255, 0.9)",
                    border: `1px solid ${theme.palette.divider}`,
                    px: 1.75,
                    py: 1,
                    borderRadius: "12px",
                    flexShrink: 0,
                    width: { xs: "100%", sm: "auto" },
                  })}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Consultation Fee
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      color: "primary.main",
                      lineHeight: 1.2,
                    }}
                  >
                    {selectedDoctor.fee || "$120"}
                    <Box
                      component="span"
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 400,
                        color: "text.secondary",
                        ml: 0.5,
                      }}
                    >
                      / visit
                    </Box>
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Booking Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "16px" }}>
              {submitError}
            </Alert>
          )}

          {/* Patient Details */}
          <Box sx={{ mb: 3 }}>
            <Stack
              direction="row"
              sx={{ alignItems: "center", gap: 1, mb: 1.5 }}
            >
              <PersonOutlineRoundedIcon
                sx={{ fontSize: 18, color: "primary.main" }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "text.primary",
                }}
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

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 2,
                }}
              >
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
                          sx={{ fontSize: 18, color: "text.secondary", mr: 1 }}
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
                          sx={{ fontSize: 18, color: "text.secondary", mr: 1 }}
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
            </Stack>
          </Box>

          {/* Consultation Type Selector */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "text.secondary",
                mb: 1.25,
              }}
            >
              Consultation Mode *
            </Typography>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 1.5,
                  }}
                >
                  {/* Option 1: In-Clinic */}
                  <Card
                    elevation={0}
                    onClick={() => field.onChange("In-Clinic")}
                    sx={(theme) => ({
                      cursor: "pointer",
                      borderRadius: "16px",
                      p: 2,
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      border: `1px solid ${
                        field.value === "In-Clinic"
                          ? theme.palette.primary.main
                          : theme.palette.divider
                      }`,
                      bgcolor:
                        field.value === "In-Clinic"
                          ? theme.palette.mode === "dark"
                            ? "rgba(13, 148, 136, 0.15)"
                            : "rgba(13, 148, 136, 0.06)"
                          : "background.paper",
                      "&:hover": {
                        bgcolor:
                          field.value === "In-Clinic"
                            ? undefined
                            : theme.palette.mode === "dark"
                              ? "rgba(51, 65, 85, 0.4)"
                              : "rgba(241, 245, 249, 0.7)",
                      },
                    })}
                  >
                    <Stack
                      direction="row"
                      sx={{ alignItems: "flex-start", gap: 1.5 }}
                    >
                      <Box
                        sx={(theme) => ({
                          width: 36,
                          height: 36,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          bgcolor:
                            field.value === "In-Clinic"
                              ? theme.palette.primary.main
                              : theme.palette.mode === "dark"
                                ? "rgba(51, 65, 85, 0.6)"
                                : "rgba(241, 245, 249, 1)",
                          color:
                            field.value === "In-Clinic"
                              ? theme.palette.primary.contrastText
                              : "text.secondary",
                        })}
                      >
                        <LocalHospitalRoundedIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: "text.primary",
                            lineHeight: 1.2,
                          }}
                        >
                          In-Clinic Visit
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            display: "block",
                            mt: 0.25,
                            fontSize: "0.75rem",
                          }}
                        >
                          Direct consultation at medical center
                        </Typography>
                      </Box>
                    </Stack>
                    {field.value === "In-Clinic" && (
                      <CheckCircleRoundedIcon
                        sx={{ fontSize: 20, color: "primary.main" }}
                      />
                    )}
                  </Card>

                  {/* Option 2: Video Consultation */}
                  <Card
                    elevation={0}
                    onClick={() => field.onChange("Video Consultation")}
                    sx={(theme) => ({
                      cursor: "pointer",
                      borderRadius: "16px",
                      p: 2,
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      border: `1px solid ${
                        field.value === "Video Consultation"
                          ? theme.palette.primary.main
                          : theme.palette.divider
                      }`,
                      bgcolor:
                        field.value === "Video Consultation"
                          ? theme.palette.mode === "dark"
                            ? "rgba(13, 148, 136, 0.15)"
                            : "rgba(13, 148, 136, 0.06)"
                          : "background.paper",
                      "&:hover": {
                        bgcolor:
                          field.value === "Video Consultation"
                            ? undefined
                            : theme.palette.mode === "dark"
                              ? "rgba(51, 65, 85, 0.4)"
                              : "rgba(241, 245, 249, 0.7)",
                      },
                    })}
                  >
                    <Stack
                      direction="row"
                      sx={{ alignItems: "flex-start", gap: 1.5 }}
                    >
                      <Box
                        sx={(theme) => ({
                          width: 36,
                          height: 36,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          bgcolor:
                            field.value === "Video Consultation"
                              ? theme.palette.primary.main
                              : theme.palette.mode === "dark"
                                ? "rgba(51, 65, 85, 0.6)"
                                : "rgba(241, 245, 249, 1)",
                          color:
                            field.value === "Video Consultation"
                              ? theme.palette.primary.contrastText
                              : "text.secondary",
                        })}
                      >
                        <VideocamRoundedIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: "text.primary",
                            lineHeight: 1.2,
                          }}
                        >
                          Video Call
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            display: "block",
                            mt: 0.25,
                            fontSize: "0.75rem",
                          }}
                        >
                          Secure online telehealth consultation
                        </Typography>
                      </Box>
                    </Stack>
                    {field.value === "Video Consultation" && (
                      <CheckCircleRoundedIcon
                        sx={{ fontSize: 20, color: "primary.main" }}
                      />
                    )}
                  </Card>
                </Box>
              )}
            />
          </Box>

          {/* Date & Time Slot Section */}
          <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 18, color: "primary.main" }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "text.primary",
                }}
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
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "text.secondary",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        <AccessTimeRoundedIcon
                          sx={{ fontSize: 15, color: "primary.main" }}
                        />
                        Select Time Slot *
                      </Typography>
                      {field.value && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.75rem",
                            color: "primary.main",
                            fontWeight: 700,
                          }}
                        >
                          Selected: {field.value}
                        </Typography>
                      )}
                    </Stack>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(2, 1fr)",
                          sm: "repeat(3, 1fr)",
                        },
                        gap: { xs: 1, sm: 1.25 },
                      }}
                    >
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
                                  color: isSelected
                                    ? "inherit"
                                    : "text.secondary",
                                }}
                              />
                            }
                            sx={(theme) => ({
                              py: 1,
                              px: 1.5,
                              borderRadius: "12px",
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              fontWeight: 600,
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
                                    borderColor: theme.palette.divider,
                                    color: theme.palette.text.primary,
                                    bgcolor: "background.paper",
                                    "&:hover": {
                                      bgcolor:
                                        theme.palette.mode === "dark"
                                          ? "rgba(51, 65, 85, 0.5)"
                                          : "rgba(241, 245, 249, 0.8)",
                                      borderColor: theme.palette.primary.main,
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
                )}
              />
              {errors.timeSlot && (
                <FormHelperText
                  sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.75 }}
                >
                  {errors.timeSlot.message}
                </FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Notes Section */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 1 }}>
              <NotesRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "text.secondary",
                }}
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

          {/* Form Actions */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={(theme) => ({
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            })}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/doctors")}
              disabled={isSubmitting}
              sx={(theme) => ({
                width: { xs: "100%", sm: "33.33%" },
                py: 1.5,
                borderRadius: "12px",
                fontWeight: 600,
                borderColor: theme.palette.divider,
                color: "text.secondary",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(51, 65, 85, 0.4)"
                      : "rgba(241, 245, 249, 0.8)",
                  borderColor: theme.palette.divider,
                },
              })}
            >
              Cancel / Back
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || loadingDoctor || !selectedDoctor}
              startIcon={
                isSubmitting ? (
                  <CircularProgress
                    size={18}
                    sx={{ color: "primary.contrastText" }}
                  />
                ) : (
                  <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
                )
              }
              sx={{
                width: { xs: "100%", sm: "66.66%" },
                py: 1.5,
                fontWeight: 700,
                borderRadius: "12px",
                boxShadow: 1,
              }}
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
          sx={{
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "0.875rem",
            boxShadow: 3,
          }}
        >
          Appointment confirmed! Redirecting to your appointments...
        </Alert>
      </Snackbar>
    </Box>
  );
}
