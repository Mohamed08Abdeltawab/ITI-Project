import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Stack,
  Typography,
  Card,
  Avatar,
  Badge,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Chip,
  MenuItem,
  Skeleton,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BloodtypeRoundedIcon from "@mui/icons-material/BloodtypeRounded";
import ContactEmergencyRoundedIcon from "@mui/icons-material/ContactEmergencyRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import NoteAltRoundedIcon from "@mui/icons-material/NoteAltRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ClearAllRoundedIcon from "@mui/icons-material/ClearAllRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { getDoctors } from "../services/api";
import DoctorCard from "../components/DoctorCard";

export default function ProfilePage() {
  const navigate = useNavigate();

  // Controlled Profile State
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 019-2834",
    bloodGroup: "O+",
    emergencyContact: "+1 (555) 014-9988 (Jane Doe - Spouse)",
    insuranceProvider: "CarePlus Shield #99281-CP",
  });

  // Theme Toggle State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Favorite Doctors State
  const [favoriteDoctors, setFavoriteDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Notification State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // useRef Uncontrolled Input Demonstration
  const medicalMemoRef = useRef(null);
  const [refOutputMessage, setRefOutputMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    getDoctors()
      .then((res) => {
        if (!isMounted) return;
        const docs = Array.isArray(res.data) ? res.data : [];
        // Take top 2 doctors as sample favorites
        setFavoriteDoctors(docs.slice(0, 2));
      })
      .catch(() => {
        // Fallback gracefully
      })
      .finally(() => {
        if (isMounted) setLoadingDoctors(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSnackbarMessage("Profile details updated successfully!");
    setSnackbarOpen(true);
  };

  const handleThemeSwitch = (e) => {
    const checked = e.target.checked;
    setIsDarkMode(checked);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", checked);
    }
    setSnackbarMessage(
      checked ? "Dark mode activated!" : "Light mode activated!",
    );
    setSnackbarOpen(true);
  };

  // useRef demonstrations
  const handleReadRef = () => {
    if (medicalMemoRef.current) {
      const val = medicalMemoRef.current.value.trim();
      setRefOutputMessage(
        val
          ? `Read via useRef: "${val}"`
          : "Uncontrolled input is currently empty! Type something above and click read.",
      );
    }
  };

  const handleFocusRef = () => {
    if (medicalMemoRef.current) {
      medicalMemoRef.current.focus();
      setRefOutputMessage(
        "Focused the input element directly using medicalMemoRef.current.focus()",
      );
    }
  };

  const handleClearRef = () => {
    if (medicalMemoRef.current) {
      medicalMemoRef.current.value = "";
      setRefOutputMessage(
        "Cleared input content directly via medicalMemoRef.current.value = ''",
      );
    }
  };

  return (
    <Box className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Profile Header Card */}
      <Card
        elevation={0}
        className="bg-gradient-to-r from-white via-white to-teal-50/50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs"
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          className="items-start sm:items-center justify-between gap-6"
        >
          <Stack direction="row" className="items-center gap-5">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Box className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center border-2 border-white">
                  <CheckCircleRoundedIcon sx={{ fontSize: 13 }} />
                </Box>
              }
            >
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 text-white font-bold text-2xl sm:text-3xl shadow-sm">
                JD
              </Avatar>
            </Badge>

            <Box>
              <Stack direction="row" className="items-center gap-2 mb-1">
                <Typography
                  variant="h5"
                  className="font-extrabold text-slate-900 leading-tight"
                >
                  {profile.fullName}
                </Typography>
                <Chip
                  label="Verified Patient"
                  size="small"
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-xs"
                />
              </Stack>
              <Typography variant="body2" className="text-slate-500 text-sm">
                Patient ID: #CP-884920 • Member since 2023
              </Typography>
              <Typography
                variant="caption"
                className="text-teal-700 font-semibold block mt-0.5"
              >
                Primary Insurance: {profile.insuranceProvider}
              </Typography>
            </Box>
          </Stack>

          {/* Theme Switcher Quick Widget */}
          <Box className="bg-white border border-slate-200 rounded-2xl p-3 sm:px-4 flex items-center gap-3 shadow-xs">
            {isDarkMode ? (
              <DarkModeRoundedIcon sx={{ fontSize: 20, color: "#0d9488" }} />
            ) : (
              <LightModeRoundedIcon sx={{ fontSize: 20, color: "#f59e0b" }} />
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={handleThemeSwitch}
                  color="primary"
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#0d9488",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#0d9488",
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="caption"
                  className="font-bold text-slate-700"
                >
                  {isDarkMode ? "Dark Theme" : "Light Theme"}
                </Typography>
              }
              className="m-0"
            />
          </Box>
        </Stack>
      </Card>

      {/* Grid: Profile Form + useRef Demonstration */}
      <Box className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: User Profile Form */}
        <Box className="lg:col-span-7">
          <Card
            elevation={0}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8"
          >
            <Stack direction="row" className="items-center gap-2 mb-6">
              <PersonRoundedIcon sx={{ fontSize: 22, color: "#0d9488" }} />
              <Typography
                variant="h6"
                className="font-bold text-slate-900 leading-tight"
              >
                Personal Medical Information
              </Typography>
            </Stack>

            <Box
              component="form"
              onSubmit={handleSaveProfile}
              className="space-y-4"
            >
              <TextField
                fullWidth
                label="Full Legal Name"
                size="small"
                value={profile.fullName}
                onChange={(e) =>
                  handleProfileChange("fullName", e.target.value)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                  },
                }}
              />

              <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  label="Email Address"
                  size="small"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <EmailOutlinedIcon
                        sx={{ fontSize: 18, color: "#94a3b8", mr: 1 }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  size="small"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <PhoneOutlinedIcon
                        sx={{ fontSize: 18, color: "#94a3b8", mr: 1 }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                    },
                  }}
                />
              </Box>

              <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  select
                  label="Blood Group"
                  size="small"
                  value={profile.bloodGroup}
                  onChange={(e) =>
                    handleProfileChange("bloodGroup", e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <BloodtypeRoundedIcon
                        sx={{ fontSize: 18, color: "#ef4444", mr: 1 }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                    },
                  }}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ),
                  )}
                </TextField>

                <TextField
                  fullWidth
                  label="Insurance Provider"
                  size="small"
                  value={profile.insuranceProvider}
                  onChange={(e) =>
                    handleProfileChange("insuranceProvider", e.target.value)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="Emergency Contact"
                size="small"
                value={profile.emergencyContact}
                onChange={(e) =>
                  handleProfileChange("emergencyContact", e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <ContactEmergencyRoundedIcon
                      sx={{ fontSize: 18, color: "#94a3b8", mr: 1 }}
                    />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                  },
                }}
              />

              <Box className="pt-2">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveRoundedIcon />}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-6 py-2.5 shadow-xs"
                >
                  Save Profile Changes
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Right Column: useRef Uncontrolled Input Demo */}
        <Box className="lg:col-span-5">
          <Card
            elevation={0}
            className="bg-white border border-teal-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full bg-gradient-to-b from-white to-teal-50/20"
          >
            <Box>
              <Stack direction="row" className="items-center gap-2 mb-2">
                <NoteAltRoundedIcon sx={{ fontSize: 22, color: "#0d9488" }} />
                <Typography
                  variant="h6"
                  className="font-bold text-slate-900 leading-tight"
                >
                  Emergency Medical Memo
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                className="text-slate-500 text-xs sm:text-sm mb-4"
              >
                Demonstration of an{" "}
                <span className="font-bold text-teal-700">
                  uncontrolled input
                </span>{" "}
                using React&apos;s{" "}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 text-xs font-mono">
                  useRef
                </code>{" "}
                hook. Value is managed directly by the DOM without triggering
                state re-renders.
              </Typography>

              {/* Uncontrolled Input Element */}
              <Box className="mb-4">
                <Typography
                  variant="caption"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5"
                >
                  Uncontrolled Note (Allergies / Instructions)
                </Typography>
                <TextField
                  inputRef={medicalMemoRef}
                  fullWidth
                  multiline
                  rows={3}
                  defaultValue="Penicillin allergy; wears soft medical contact lenses."
                  placeholder="Type an urgent note for first responders..."
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      bgcolor: "#ffffff",
                      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                    },
                  }}
                />
              </Box>

              {/* Action Buttons utilizing the ref */}
              <Stack
                direction="row"
                spacing={1}
                className="flex-wrap gap-2 mb-4"
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityRoundedIcon />}
                  onClick={handleReadRef}
                  className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50 text-xs font-bold"
                >
                  Read via Ref
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditRoundedIcon />}
                  onClick={handleFocusRef}
                  className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Focus via Ref
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ClearAllRoundedIcon />}
                  onClick={handleClearRef}
                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                >
                  Clear via Ref
                </Button>
              </Stack>

              {/* Ref Output Display */}
              {refOutputMessage && (
                <Alert
                  severity="info"
                  className="rounded-xl text-xs font-medium border border-teal-150 bg-teal-50/80 text-teal-900"
                >
                  {refOutputMessage}
                </Alert>
              )}
            </Box>

            <Box className="mt-4 pt-3 border-t border-slate-150 text-xs text-slate-400">
              ⚡ Directly interacts with DOM via{" "}
              <code className="text-slate-600 font-mono">
                medicalMemoRef.current
              </code>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Favorite Doctors Section */}
      <Box className="space-y-4 pt-2">
        <Stack direction="row" className="items-center justify-between">
          <Stack direction="row" className="items-center gap-2">
            <FavoriteRoundedIcon sx={{ fontSize: 22, color: "#ef4444" }} />
            <Typography
              variant="h6"
              className="font-bold text-slate-900 tracking-tight"
            >
              Favorite Doctors ({favoriteDoctors.length})
            </Typography>
          </Stack>

          <Button
            size="small"
            onClick={() => navigate("/doctors")}
            className="text-teal-600 font-bold text-xs hover:underline"
          >
            Explore More Specialists →
          </Button>
        </Stack>

        {loadingDoctors && (
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={260}
                className="rounded-2xl"
              />
            ))}
          </Box>
        )}

        {!loadingDoctors && favoriteDoctors.length > 0 && (
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoriteDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                isFav={true}
                onToggleFavorite={(d) => {
                  setFavoriteDoctors((prev) =>
                    prev.filter((item) => item.id !== d.id),
                  );
                  setSnackbarMessage(`Removed ${d.name} from favorites.`);
                  setSnackbarOpen(true);
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Notification Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          className="rounded-xl font-semibold text-sm shadow-md"
          sx={{ bgcolor: "#0d9488" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
