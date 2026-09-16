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
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => !prev);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  return (
    <Box
      component="header"
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-colors"
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
            className="font-extrabold tracking-tight text-slate-900"
          >
            Care<span className="text-teal-600">Point</span>
          </Typography>
        </NavLink>

        {/* Desktop Navigation Links (md and above) */}
        <Box
          component="nav"
          className="hidden md:flex items-center gap-2 lg:gap-3"
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  item.isActive
                    ? "bg-teal-50 text-teal-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon sx={{ fontSize: 18 }} />
                <span>{item.label}</span>
                {item.badgeCount !== undefined && (
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
          <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"} arrow>
            <IconButton
              onClick={handleThemeToggle}
              size="small"
              aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              {isDarkMode ? (
                <LightModeRoundedIcon sx={{ fontSize: 19 }} />
              ) : (
                <DarkModeRoundedIcon sx={{ fontSize: 19 }} />
              )}
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            className="h-5 my-auto border-slate-200"
          />

          <Tooltip title="User Profile" arrow>
            <IconButton
              onClick={() => navigate("/profile")}
              size="small"
              aria-label="User Profile"
              className="w-9 h-9 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <PersonRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Mobile Action Controls (xs to sm) */}
        <Box className="flex md:hidden items-center gap-1.5">
          <IconButton
            onClick={handleThemeToggle}
            size="small"
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            {isDarkMode ? (
              <LightModeRoundedIcon sx={{ fontSize: 19 }} />
            ) : (
              <DarkModeRoundedIcon sx={{ fontSize: 19 }} />
            )}
          </IconButton>

          <IconButton
            onClick={handleDrawerToggle}
            size="small"
            aria-label="Open navigation menu"
            className="w-9 h-9 rounded-xl border border-slate-200 text-slate-900 hover:bg-slate-50"
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
            bgcolor: "#ffffff",
            borderLeft: "1px solid #f1f5f9",
            boxShadow: "-8px 0 32px rgba(15, 23, 42, 0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box className="flex flex-col flex-grow">
          {/* Drawer Header */}
          <Box className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
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
                className="font-bold tracking-tight text-slate-900"
              >
                Care<span className="text-teal-600">Point</span>
              </Typography>
            </NavLink>

            <IconButton
              onClick={handleDrawerToggle}
              size="small"
              aria-label="Close navigation menu"
              className="text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              <CloseRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Drawer Navigation List */}
          <Box className="px-3 py-4">
            <Typography
              variant="caption"
              className="px-3 mb-2 block font-bold tracking-wider uppercase text-slate-400 text-xs"
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
                          ? "bg-teal-50 text-teal-600 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <ListItemIcon
                        className={`min-w-9 ${
                          item.isActive ? "text-teal-600" : "text-slate-500"
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
        <Box className="p-4 bg-slate-50/70 border-t border-slate-100">
          {/* User Account Snippet */}
          <Box className="flex items-center gap-3 p-3 mb-3 rounded-2xl bg-white border border-slate-150 shadow-xs">
            <Box className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              JD
            </Box>
            <Box className="min-w-0 flex-1">
              <Typography
                variant="body2"
                className="font-bold text-slate-900 leading-tight truncate"
              >
                John Doe
              </Typography>
              <Typography
                variant="caption"
                className="text-slate-500 block text-xs truncate"
              >
                Patient Account
              </Typography>
            </Box>
          </Box>

          {/* Action List */}
          <Stack spacing={0.5}>
            <ListItemButton
              onClick={handleThemeToggle}
              className="rounded-xl py-2 px-3 text-slate-700 hover:bg-slate-100"
            >
              <ListItemIcon className="min-w-8 text-slate-500">
                {isDarkMode ? (
                  <LightModeRoundedIcon sx={{ fontSize: 20 }} />
                ) : (
                  <DarkModeRoundedIcon sx={{ fontSize: 20 }} />
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
                className="bg-teal-50 text-teal-600 font-bold text-xs h-5"
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => handleNavClick("/profile")}
              className="rounded-xl py-2 px-3 text-slate-700 hover:bg-slate-100"
            >
              <ListItemIcon className="min-w-8 text-slate-500">
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
              className="rounded-xl py-2 px-3 text-red-600 hover:bg-red-50"
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
