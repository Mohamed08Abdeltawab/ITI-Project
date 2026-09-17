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
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import NoteAltRoundedIcon from "@mui/icons-material/NoteAltRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ClearAllRoundedIcon from "@mui/icons-material/ClearAllRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { getDoctors } from "../services/api";
import DoctorCard from "../components/DoctorCard";
import { useThemeStore } from "../stores/useThemeStore";

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

  // Global Theme Store
  const themeMode = useThemeStore((state) => state.themeMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDarkMode = themeMode === "dark";

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

  const handleThemeToggle = () => {
    toggleTheme();
    const nextMode = themeMode === "light" ? "Dark" : "Light";
    setSnackbarMessage(`${nextMode} mode activated!`);
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        maxWidth: 1024,
        mx: "auto",
        py: 1,
      }}
    >
      {/* Profile Header Card */}
      <Card
        elevation={0}
        sx={(theme) => ({
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(13, 148, 136, 0.15) 100%)"
              : "linear-gradient(135deg, #ffffff 0%, rgba(204, 251, 241, 0.4) 100%)",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "24px",
          p: { xs: 3, sm: 4 },
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        })}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 2.5 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Box
                  sx={(theme) => ({
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${theme.palette.background.paper}`,
                  })}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 13 }} />
                </Box>
              }
            >
              <Avatar
                sx={(theme) => ({
                  width: { xs: 80, sm: 96 },
                  height: { xs: 80, sm: 96 },
                  borderRadius: "24px",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "primary.main"
                      : "text.primary",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.875rem" },
                  boxShadow: 1,
                })}
              >
                JD
              </Avatar>
            </Badge>

            <Box>
              <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "text.primary",
                    lineHeight: 1.2,
                  }}
                >
                  {profile.fullName}
                </Typography>
                <Chip
                  label="Verified Patient"
                  size="small"
                  sx={(theme) => ({
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(16, 185, 129, 0.1)",
                    color: theme.palette.success.main,
                    border: `1px solid ${
                      theme.palette.mode === "dark"
                        ? "rgba(16, 185, 129, 0.3)"
                        : "rgba(16, 185, 129, 0.2)"
                    }`,
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  })}
                />
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontSize: "0.875rem" }}
              >
                Patient ID: #CP-884920 • Member since 2023
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  display: "block",
                  mt: 0.25,
                }}
              >
                Primary Insurance: {profile.insuranceProvider}
              </Typography>
            </Box>
          </Stack>

          {/* Theme Switcher Quick Widget */}
          <Box
            sx={(theme) => ({
              bgcolor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "16px",
              p: 1.5,
              px: { sm: 2 },
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            })}
          >
            {isDarkMode ? (
              <LightModeOutlinedIcon sx={{ fontSize: 20, color: "warning.main" }} />
            ) : (
              <DarkModeOutlinedIcon sx={{ fontSize: 20, color: "primary.main" }} />
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={handleThemeToggle}
                  color="primary"
                />
              }
              label={
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  {isDarkMode ? "Dark Theme" : "Light Theme"}
                </Typography>
              }
              sx={{ m: 0 }}
            />
          </Box>
        </Stack>
      </Card>

      {/* Grid: Profile Form + App Preferences & useRef Demonstration */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(12, 1fr)" }, gap: 3 }}>
        {/* Left Column: User Profile Form */}
        <Box sx={{ gridColumn: { lg: "span 7" } }}>
          <Card
            elevation={0}
            sx={(theme) => ({
              bgcolor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "24px",
              p: { xs: 3, sm: 4 },
            })}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 3 }}>
              <PersonRoundedIcon
                sx={{
                  fontSize: 22,
                  color: "primary.main",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                Personal Medical Information
              </Typography>
            </Stack>

            <Box
              component="form"
              onSubmit={handleSaveProfile}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                fullWidth
                label="Full Legal Name"
                size="small"
                value={profile.fullName}
                onChange={(e) =>
                  handleProfileChange("fullName", e.target.value)
                }
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

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: { xs: 2, sm: 3 } }}>
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
                        sx={{ fontSize: 18, color: "text.secondary", mr: 1 }}
                      />
                    ),
                  }}
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
                  size="small"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <PhoneOutlinedIcon
                        sx={{ fontSize: 18, color: "text.secondary", mr: 1 }}
                      />
                    ),
                  }}
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

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: { xs: 2, sm: 3 } }}>
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
                        sx={{ fontSize: 18, color: "error.main", mr: 1 }}
                      />
                    ),
                  }}
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
                      sx={{ fontSize: 18, color: "text.secondary", mr: 1 }}
                    />
                  ),
                }}
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

              <Box sx={{ pt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveRoundedIcon />}
                  sx={{
                    fontWeight: 700,
                    borderRadius: "12px",
                    px: 3,
                    py: 1.25,
                    boxShadow: 1,
                    textTransform: "none",
                  }}
                >
                  Save Profile Changes
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Right Column: App Preferences & useRef Uncontrolled Input Demo */}
        <Box sx={{ gridColumn: { lg: "span 5" }, display: "flex", flexDirection: "column", gap: 3 }}>
          {/* App Preferences Section */}
          <Card
            elevation={0}
            sx={(theme) => ({
              bgcolor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "24px",
              p: { xs: 3.5, sm: 4 },
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            })}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                mb: { xs: 2, sm: 2.5 },
              }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: 1.25 }}>
                <Box
                  sx={(theme) => ({
                    width: 36,
                    height: 36,
                    borderRadius: "12px",
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(13, 148, 136, 0.2)"
                        : "rgba(13, 148, 136, 0.1)",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  })}
                >
                  <TuneRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      lineHeight: 1.2,
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                    }}
                  >
                    App Preferences
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                  >
                    Theme &amp; visual appearance
                  </Typography>
                </Box>
              </Stack>

              <Chip
                label={isDarkMode ? "Dark Mode" : "Light Mode"}
                size="small"
                icon={
                  isDarkMode ? (
                    <LightModeOutlinedIcon
                      sx={{
                        fontSize: "16px !important",
                        color: "warning.main !important",
                      }}
                    />
                  ) : (
                    <DarkModeOutlinedIcon
                      sx={{
                        fontSize: "16px !important",
                        color: "primary.main !important",
                      }}
                    />
                  )
                }
                sx={(theme) => ({
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(51, 65, 85, 0.6)"
                      : "rgba(13, 148, 136, 0.08)",
                  color:
                    theme.palette.mode === "dark"
                      ? "primary.light"
                      : "primary.main",
                  border: `1px solid ${theme.palette.divider}`,
                })}
              />
            </Stack>

            <Box
              sx={(theme) => ({
                p: { xs: 2.5, sm: 3 },
                borderRadius: "16px",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(15, 23, 42, 0.6)"
                    : "rgba(248, 250, 252, 0.8)",
                border: `1px solid ${theme.palette.divider}`,
                my: "auto",
              })}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      fontSize: "0.875rem",
                    }}
                  >
                    {isDarkMode ? "Dark Theme Enabled" : "Light Theme Enabled"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      lineHeight: 1.6,
                      display: "block",
                      mt: 0.25,
                    }}
                  >
                    {isDarkMode
                      ? "Dark palette (#0b1120 default, #1e293b paper) with brand teal accent."
                      : "Light palette (#f8fafc default, #ffffff paper) with brand teal accent."}
                  </Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={isDarkMode}
                      onChange={handleThemeToggle}
                      color="primary"
                    />
                  }
                  label=""
                  sx={{ m: 0 }}
                />
              </Stack>
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                display: "block",
                mt: 2,
                px: 0.5,
              }}
            >
              ✓ Synchronized across Material UI v5, Tailwind CSS, and saved in
              localStorage.
            </Typography>
          </Card>

          {/* Emergency Medical Memo Card */}
          <Card
            elevation={0}
            sx={(theme) => ({
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, rgba(13, 148, 136, 0.08) 100%)"
                  : "linear-gradient(180deg, #ffffff 0%, rgba(204, 251, 241, 0.15) 100%)",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "24px",
              p: { xs: 3, sm: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            })}
          >
            <Box>
              <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 1 }}>
                <NoteAltRoundedIcon
                  sx={{
                    fontSize: 22,
                    color: "primary.main",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1.2,
                  }}
                >
                  Emergency Medical Memo
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  mb: 2,
                }}
              >
                Demonstration of an{" "}
                <Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
                  uncontrolled input
                </Box>{" "}
                using React&apos;s{" "}
                <Box
                  component="code"
                  sx={(theme) => ({
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(51, 65, 85, 0.8)"
                        : "rgba(241, 245, 249, 1)",
                    px: 0.75,
                    py: 0.25,
                    borderRadius: "4px",
                    color: "text.primary",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                  })}
                >
                  useRef
                </Box>{" "}
                hook.
              </Typography>

              {/* Uncontrolled Input Element */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "text.secondary",
                    mb: 0.75,
                  }}
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

              {/* Action Buttons utilizing the ref */}
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityRoundedIcon />}
                  onClick={handleReadRef}
                  sx={(theme) => ({
                    borderRadius: "12px",
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(13, 148, 136, 0.4)"
                        : "rgba(13, 148, 136, 0.3)",
                    color: "primary.main",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(13, 148, 136, 0.15)"
                          : "rgba(13, 148, 136, 0.08)",
                    },
                  })}
                >
                  Read via Ref
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditRoundedIcon />}
                  onClick={handleFocusRef}
                  sx={(theme) => ({
                    borderRadius: "12px",
                    borderColor: theme.palette.divider,
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(51, 65, 85, 0.5)"
                          : "rgba(241, 245, 249, 0.8)",
                    },
                  })}
                >
                  Focus via Ref
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<ClearAllRoundedIcon />}
                  onClick={handleClearRef}
                  sx={{
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Clear via Ref
                </Button>
              </Stack>

              {/* Ref Output Display */}
              {refOutputMessage && (
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {refOutputMessage}
                </Alert>
              )}
            </Box>

            <Box
              sx={(theme) => ({
                mt: 2,
                pt: 1.5,
                borderTop: `1px solid ${theme.palette.divider}`,
                fontSize: "0.75rem",
                color: "text.secondary",
              })}
            >
              ⚡ Directly interacts with DOM via{" "}
              <Box component="code" sx={{ color: "text.primary", fontFamily: "monospace" }}>
                medicalMemoRef.current
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Favorite Doctors Section */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <FavoriteRoundedIcon sx={{ fontSize: 22, color: "error.main" }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                letterSpacing: "-0.025em",
              }}
            >
              Favorite Doctors ({favoriteDoctors.length})
            </Typography>
          </Stack>

          <Button
            size="small"
            onClick={() => navigate("/doctors")}
            sx={{
              color: "primary.main",
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Explore More Specialists →
          </Button>
        </Stack>

        {loadingDoctors && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3 }}>
            {[1, 2].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={260}
                sx={{ borderRadius: "16px" }}
              />
            ))}
          </Box>
        )}

        {!loadingDoctors && favoriteDoctors.length > 0 && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3 }}>
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
          sx={{ borderRadius: "12px", fontWeight: 600, fontSize: "0.875rem", boxShadow: 3 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
