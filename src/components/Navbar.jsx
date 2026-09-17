import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import { useThemeStore } from "../stores/useThemeStore";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Global theme state from Zustand
  const themeMode = useThemeStore((state) => state.themeMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDarkMode = themeMode === "dark";

  const isDoctorsActive =
    location.pathname === "/" || location.pathname.startsWith("/doctors");

  const isAppointmentsActive = location.pathname.startsWith("/appointments");
  const isProfileActive = location.pathname.startsWith("/profile");

  const navLinks = [
    {
      label: "Doctors",
      path: "/doctors",
      icon: MedicalServicesRoundedIcon,
      isActive: isDoctorsActive,
    },
    {
      label: "My Appointments",
      path: "/appointments",
      icon: CalendarMonthRoundedIcon,
      badgeCount: 2,
      isActive: isAppointmentsActive,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: PersonOutlineRoundedIcon,
      isActive: isProfileActive,
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <Box
      component="header"
      sx={(theme) => ({
        position: "sticky",
        top: 0,
        zIndex: 50,
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(11, 17, 32, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      })}
    >
      <Box
        sx={{
          maxWidth: 1280,
          mx: "auto",
          px: { xs: 2, sm: 3, lg: 4 },
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 no-underline group"
          onClick={() => setMobileOpen(false)}
        >
          <Box
            sx={(theme) => ({
              width: 40,
              height: 40,
              borderRadius: 3,
              bgcolor: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.palette.primary.contrastText,
              boxShadow: "0 1px 2px rgba(13, 148, 136, 0.2)",
              transition: "transform 0.2s ease",
              ".group:hover &": {
                transform: "scale(1.05)",
              },
            })}
          >
            <LocalHospitalRoundedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography
            variant="h6"
            sx={(theme) => ({
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: theme.palette.text.primary,
            })}
          >
            Care
            <span className="text-[var(--primary-color)]">Point</span>
          </Typography>
        </NavLink>

        {/* Desktop Navigation Links (md and above) */}
        <Box
          component="nav"
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: { md: 1, lg: 1.5 },
          }}
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  item.isActive
                    ? "bg-[var(--primary-light)] text-[var(--primary-color)] font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
                }`}
              >
                <Icon sx={{ fontSize: 18 }} />
                <span>{item.label}</span>
                {item.badgeCount !== undefined && (
                  <Chip
                    label={item.badgeCount}
                    size="small"
                    sx={(theme) => ({
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 700,
                      height: 20,
                      minWidth: 20,
                      fontSize: "0.75rem",
                      "& .MuiChip-label": { px: 0.75 },
                    })}
                  />
                )}
              </NavLink>
            );
          })}
        </Box>

        {/* Desktop Side Actions (md and above) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Tooltip
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            arrow
          >
            <IconButton
              onClick={toggleTheme}
              size="small"
              aria-label="Toggle dark mode"
              sx={(theme) => ({
                width: 36,
                height: 36,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.secondary,
                transition:
                  "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease",
                "&:hover": {
                  transform: "rotate(15deg) scale(1.05)",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "grey.50",
                },
              })}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
              >
                {isDarkMode ? (
                  <LightModeOutlinedIcon
                    sx={(theme) => ({
                      fontSize: 19,
                      color: theme.palette.warning.main,
                    })}
                  />
                ) : (
                  <DarkModeOutlinedIcon
                    sx={(theme) => ({
                      fontSize: 19,
                      color: theme.palette.primary.main,
                    })}
                  />
                )}
              </Box>
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ height: 20, my: "auto" }}
          />

          <Tooltip title="User Profile" arrow>
            <IconButton
              onClick={() => navigate("/profile")}
              size="small"
              aria-label="User Profile"
              sx={(theme) => ({
                width: 36,
                height: 36,
                borderRadius: 3,
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                boxShadow: 1,
                transition: "background-color 0.2s ease",
                "&:hover": {
                  bgcolor: theme.palette.secondary.dark,
                },
              })}
            >
              <PersonRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Mobile Action Controls (xs to sm) */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 0.75,
          }}
        >
          <IconButton
            onClick={toggleTheme}
            size="small"
            aria-label="Toggle dark mode"
            sx={(theme) => ({
              width: 36,
              height: 36,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.secondary,
              transition: "transform 0.3s ease",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "grey.50",
              },
            })}
          >
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease",
              }}
            >
              {isDarkMode ? (
                <LightModeOutlinedIcon
                  sx={(theme) => ({
                    fontSize: 19,
                    color: theme.palette.warning.main,
                  })}
                />
              ) : (
                <DarkModeOutlinedIcon
                  sx={(theme) => ({
                    fontSize: 19,
                    color: theme.palette.primary.main,
                  })}
                />
              )}
            </Box>
          </IconButton>

          <IconButton
            onClick={handleDrawerToggle}
            size="small"
            aria-label="Open navigation menu"
            sx={(theme) => ({
              width: 36,
              height: 36,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.primary,
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "grey.50",
              },
            })}
          >
            <MenuRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Mobile Drawer (Sidebar) */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: (theme) => ({
            width: { xs: "82vw", sm: 340 },
            maxWidth: 360,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderLeft: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "-8px 0 32px rgba(0, 0, 0, 0.4)"
                : "-8px 0 32px rgba(15, 23, 42, 0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }),
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          {/* Drawer Header */}
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2.5,
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            })}
          >
            <NavLink
              to="/"
              className="flex items-center gap-2.5 no-underline"
              onClick={() => setMobileOpen(false)}
            >
              <Box
                sx={(theme) => ({
                  width: 32,
                  height: 32,
                  borderRadius: 2.5,
                  bgcolor: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.palette.primary.contrastText,
                  boxShadow: 1,
                })}
              >
                <LocalHospitalRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                variant="subtitle1"
                sx={(theme) => ({
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: theme.palette.text.primary,
                })}
              >
                Care
                <span className="text-[var(--primary-color)]">Point</span>
              </Typography>
            </NavLink>

            <IconButton
              onClick={handleDrawerToggle}
              size="small"
              aria-label="Close navigation menu"
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "grey.50",
                },
              })}
            >
              <CloseRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Drawer Navigation List */}
          <Box sx={{ px: 1.5, py: 2 }}>
            <Typography
              variant="caption"
              sx={(theme) => ({
                px: 1.5,
                mb: 1,
                display: "block",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
              })}
            >
              Navigation Menu
            </Typography>

            <List
              disablePadding
              sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
            >
              {navLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavClick(item.path)}
                      sx={(theme) => ({
                        borderRadius: 3,
                        py: 1.25,
                        px: 1.75,
                        transition: "all 0.2s ease",
                        bgcolor: item.isActive
                          ? theme.palette.mode === "dark"
                            ? "rgba(20, 184, 166, 0.15)"
                            : "rgba(13, 148, 136, 0.08)"
                          : "transparent",
                        color: item.isActive
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        "&:hover": {
                          bgcolor: item.isActive
                            ? theme.palette.mode === "dark"
                              ? "rgba(20, 184, 166, 0.25)"
                              : "rgba(13, 148, 136, 0.15)"
                            : theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.05)"
                              : "grey.50",
                          color: item.isActive
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                        },
                      })}
                    >
                      <ListItemIcon
                        sx={(theme) => ({
                          minWidth: 36,
                          color: item.isActive
                            ? theme.palette.primary.main
                            : theme.palette.text.secondary,
                        })}
                      >
                        <IconComponent sx={{ fontSize: 22 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: "0.925rem",
                          fontWeight: item.isActive ? 700 : 500,
                        }}
                      />
                      {item.badgeCount !== undefined && (
                        <Chip
                          label={item.badgeCount}
                          size="small"
                          sx={(theme) => ({
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            fontWeight: 700,
                            height: 20,
                            minWidth: 20,
                          })}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>

        {/* Drawer Footer Actions */}
        <Box
          sx={(theme) => ({
            p: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(15, 23, 42, 0.6)"
                : "rgba(248, 250, 252, 0.7)",
            borderTop: `1px solid ${theme.palette.divider}`,
          })}
        >
          {/* User Account Snippet */}
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              mb: 1.5,
              borderRadius: 4,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: 1,
            })}
          >
            <Box
              sx={(theme) => ({
                width: 40,
                height: 40,
                borderRadius: 3,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main,
                color: theme.palette.primary.contrastText,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.875rem",
              })}
            >
              JD
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                sx={(theme) => ({
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  lineHeight: 1.25,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                })}
              >
                John Doe
              </Typography>
              <Typography
                variant="caption"
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  display: "block",
                  fontSize: "0.75rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                })}
              >
                Patient Account
              </Typography>
            </Box>
          </Box>

          {/* Action List */}
          <Stack spacing={0.5}>
            <ListItemButton
              onClick={toggleTheme}
              sx={(theme) => ({
                borderRadius: 3,
                py: 1,
                px: 1.5,
                color: theme.palette.text.primary,
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "grey.100",
                },
              })}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                {isDarkMode ? (
                  <LightModeOutlinedIcon
                    sx={(theme) => ({
                      fontSize: 20,
                      color: theme.palette.warning.main,
                    })}
                  />
                ) : (
                  <DarkModeOutlinedIcon
                    sx={(theme) => ({
                      fontSize: 20,
                      color: theme.palette.primary.main,
                    })}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={isDarkMode ? "Light Mode" : "Dark Mode"}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
              <Chip
                label={isDarkMode ? "ON" : "OFF"}
                size="small"
                sx={(theme) => ({
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  height: 20,
                  bgcolor: isDarkMode
                    ? "rgba(20, 184, 166, 0.2)"
                    : "rgba(13, 148, 136, 0.1)",
                  color: theme.palette.primary.main,
                })}
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => handleNavClick("/profile")}
              sx={(theme) => ({
                borderRadius: 3,
                py: 1,
                px: 1.5,
                color: theme.palette.text.primary,
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "grey.100",
                },
              })}
            >
              <ListItemIcon
                sx={(theme) => ({
                  minWidth: 32,
                  color: theme.palette.text.secondary,
                })}
              >
                <SettingsRoundedIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Settings & Profile"
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => setMobileOpen(false)}
              sx={(theme) => ({
                borderRadius: 3,
                py: 1,
                px: 1.5,
                color: theme.palette.error.main,
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(239, 68, 68, 0.15)"
                      : "rgba(239, 68, 68, 0.08)",
                },
              })}
            >
              <ListItemIcon
                sx={(theme) => ({
                  minWidth: 32,
                  color: theme.palette.error.main,
                })}
              >
                <LogoutRoundedIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Sign Out"
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
