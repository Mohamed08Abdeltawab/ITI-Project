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
  const [mobileOpen, setMobileOpen] = useState(false); //state for mobile
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
    navigate(path); //go to path
    setMobileOpen(false); //then close this list
  };

  return (
    <Box
      component="header"
      className="sticky top-0 z-50 bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-200"
    >
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 text-decoration-none group"
          onClick={() => setMobileOpen(false)}
        >
          <Box className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 transition-transform group-hover:scale-105">
            <LocalHospitalRoundedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography
            variant="h6"
            className="font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Care<span className="text-teal-600 dark:text-teal-400">Point</span>
          </Typography>
        </NavLink>

        {/* Desktop Navigation Links (md and above) */}
        <Box
          component="nav"
          className="hidden md:flex items-center gap-2 lg:gap-3"
        >
          {navLinks.map((item) => {
            //map in your navLinks object and show them
            const Icon = item.icon;
            return (
              //create naveLink
              <NavLink
                key={item.label}
                to={item.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  item.isActive //if active give them a style as seleceted if not give static style
                    ? "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon sx={{ fontSize: 18 }} />
                <span>{item.label}</span>
                {item.badgeCount !== undefined && ( //show badge count beside label
                  <Chip
                    label={item.badgeCount}
                    size="small"
                    className="bg-teal-600 text-white font-bold h-5 min-w-[20px] text-xs"
                    sx={{
                      "& .MuiChip-label": { px: 0.75 },
                    }}
                  />
                )}
              </NavLink>
            );
          })}
        </Box>

        {/* Desktop Side Actions (md and above) */}
        <Box className="hidden md:flex items-center gap-3">
          <Tooltip
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            arrow
          >
            <IconButton
              onClick={toggleTheme}
              size="small"
              aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              sx={{
                transition:
                  "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease",
                "&:hover": {
                  transform: "rotate(15deg) scale(1.05)",
                },
              }}
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
                    sx={{ fontSize: 19, color: "#f59e0b" }}
                  />
                ) : (
                  <DarkModeOutlinedIcon
                    sx={{ fontSize: 19, color: "#0d9488" }}
                  />
                )}
              </Box>
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            className="h-5 my-auto border-slate-200 dark:border-slate-700"
          />

          <Tooltip title="User Profile" arrow>
            <IconButton
              onClick={() => navigate("/profile")}
              size="small"
              aria-label="User Profile"
              className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              <PersonRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Mobile Action Controls (xs to sm) */}
        <Box className="flex md:hidden items-center gap-1.5">
          <IconButton
            onClick={toggleTheme}
            size="small"
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
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
                  sx={{ fontSize: 19, color: "#f59e0b" }}
                />
              ) : (
                <DarkModeOutlinedIcon sx={{ fontSize: 19, color: "#0d9488" }} />
              )}
            </Box>
          </IconButton>

          <IconButton
            onClick={handleDrawerToggle}
            size="small"
            aria-label="Open navigation menu"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
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
          sx: {
            width: { xs: "82vw", sm: 340 },
            maxWidth: 360,
            bgcolor: isDarkMode ? "#1e293b" : "#ffffff",
            color: isDarkMode ? "#f8fafc" : "#0f172a",
            borderLeft: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9",
            boxShadow: isDarkMode
              ? "-8px 0 32px rgba(0, 0, 0, 0.4)"
              : "-8px 0 32px rgba(15, 23, 42, 0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box className="flex flex-col flex-grow">
          {/* Drawer Header */}
          <Box className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <NavLink
              to="/"
              className="flex items-center gap-2.5 text-decoration-none"
              onClick={() => setMobileOpen(false)}
            >
              <Box className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
                <LocalHospitalRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                variant="subtitle1"
                className="font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Care
                <span className="text-teal-600 dark:text-teal-400">Point</span>
              </Typography>
            </NavLink>

            <IconButton
              onClick={handleDrawerToggle}
              size="small"
              aria-label="Close navigation menu"
              className="text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <CloseRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Drawer Navigation List */}
          <Box className="px-3 py-4">
            <Typography
              variant="caption"
              className="px-3 mb-2 block font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 text-xs"
            >
              Navigation Menu
            </Typography>

            <List disablePadding className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavClick(item.path)}
                      className={`rounded-xl py-2.5 px-3.5 transition-all ${
                        item.isActive
                          ? "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 font-bold"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <ListItemIcon
                        className={`min-w-9 ${
                          item.isActive
                            ? "text-teal-600 dark:text-teal-400"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
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
                          className="bg-teal-600 text-white font-bold h-5 min-w-[20px]"
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
        <Box className="p-4 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800">
          {/* User Account Snippet */}
          <Box className="flex items-center gap-3 p-3 mb-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-150 dark:border-slate-700 shadow-xs">
            <Box className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              JD
            </Box>
            <Box className="min-w-0 flex-1">
              <Typography
                variant="body2"
                className="font-bold text-slate-900 dark:text-white leading-tight truncate"
              >
                John Doe
              </Typography>
              <Typography
                variant="caption"
                className="text-slate-500 dark:text-slate-400 block text-xs truncate"
              >
                Patient Account
              </Typography>
            </Box>
          </Box>

          {/* Action List */}
          <Stack spacing={0.5}>
            <ListItemButton
              onClick={toggleTheme}
              className="rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ListItemIcon className="min-w-8 text-slate-500 dark:text-slate-400">
                {isDarkMode ? (
                  <LightModeOutlinedIcon
                    sx={{ fontSize: 20, color: "#f59e0b" }}
                  />
                ) : (
                  <DarkModeOutlinedIcon
                    sx={{ fontSize: 20, color: "#0d9488" }}
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
                className={`font-bold text-xs h-5 ${
                  isDarkMode
                    ? "bg-teal-900/50 text-teal-300"
                    : "bg-teal-50 text-teal-600"
                }`}
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => handleNavClick("/profile")}
              className="rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ListItemIcon className="min-w-8 text-slate-500 dark:text-slate-400">
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
              className="rounded-xl py-2 px-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <ListItemIcon className="min-w-8 text-red-600">
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
