import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Highlight Doctors when on home "/" or startsWith "/doctors"
  const isDoctorsActive =
    location.pathname === "/" || location.pathname.startsWith("/doctors");
  const isAppointmentsActive = location.pathname.startsWith("/appointments");
  const isProfileActive = location.pathname.startsWith("/profile");

  const navLinks = [
    {
      label: "Doctors",
      path: "/doctors",
      icon: MedicalServicesOutlinedIcon,
      isActive: isDoctorsActive,
    },
    {
      label: "MyAppointments",
      path: "/appointments",
      icon: CalendarMonthOutlinedIcon,
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 text-decoration-none group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-[#0d9488] flex items-center justify-center text-white shadow-sm shadow-teal-500/20 transition-transform group-hover:scale-105">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                width="18"
                height="18"
                x="3"
                y="3"
                rx="2"
                stroke="none"
                fill="transparent"
              />
              <path d="M12 7v10M7 12h10" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Care<span className="text-[#0d9488]">Point</span>
          </span>
        </NavLink>

        {/* Desktop Navigation Links (md and above) */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3">
          {navLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                item.isActive
                  ? "bg-[#f0fdfa] text-[#0d9488]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>{item.label}</span>
              {item.badgeCount !== undefined && (
                <span className="bg-[#0d9488] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center leading-tight">
                  {item.badgeCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Side Actions (md and above) */}
        <div className="hidden md:flex items-center gap-3">
          <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"} arrow>
            <IconButton
              onClick={handleThemeToggle}
              size="small"
              aria-label="Toggle dark mode"
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid #e2e8f0",
                color: "#475569",
                "&:hover": {
                  bgcolor: "#f8fafc",
                  color: "#0f172a",
                },
              }}
            >
              {isDarkMode ? (
                <LightModeOutlinedIcon sx={{ fontSize: 18 }} />
              ) : (
                <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>

          <div className="h-5 w-[1px] bg-slate-200" />

          <Tooltip title="Account Profile" arrow>
            <NavLink
              to="/profile"
              aria-label="User profile"
              className="w-9 h-9 rounded-full bg-[#0f172a] text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
            </NavLink>
          </Tooltip>
        </div>

        {/* Mobile Action Controls (xs to sm) */}
        <div className="flex md:hidden items-center gap-1.5">
          <IconButton
            onClick={handleThemeToggle}
            size="small"
            aria-label="Toggle dark mode"
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              color: "#475569",
              "&:hover": {
                bgcolor: "#f8fafc",
                color: "#0f172a",
              },
            }}
          >
            {isDarkMode ? (
              <LightModeOutlinedIcon sx={{ fontSize: 18 }} />
            ) : (
              <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>

          <IconButton
            onClick={handleDrawerToggle}
            aria-label="Open navigation menu"
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              color: "#0f172a",
              "&:hover": {
                bgcolor: "#f8fafc",
              },
            }}
          >
            <MenuRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer (Sidebar) */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Enhances mobile open performance
        }}
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
        {/* Drawer Header & Content Container */}
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          {/* Drawer Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2.5,
              py: 2.25,
            }}
          >
            <NavLink
              to="/"
              className="flex items-center gap-2.5 text-decoration-none"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-8 h-8 rounded-xl bg-[#0d9488] flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 7v10M7 12h10" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Care<span className="text-[#0d9488]">Point</span>
              </span>
            </NavLink>

            <IconButton
              onClick={handleDrawerToggle}
              size="small"
              aria-label="Close navigation menu"
              sx={{
                color: "#64748b",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                p: 0.75,
                "&:hover": {
                  bgcolor: "#f8fafc",
                  color: "#0f172a",
                },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: "#f1f5f9" }} />

          {/* Drawer Navigation List */}
          <Box sx={{ px: 2, py: 2.5 }}>
            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                mb: 1.5,
                display: "block",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#94a3b8",
                fontSize: "0.7rem",
              }}
            >
              Navigation
            </Typography>

            <List
              disablePadding
              disableGutters
              sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
            >
              {navLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavClick(item.path)}
                      sx={{
                        borderRadius: "12px",
                        py: 1.25,
                        px: 2,
                        bgcolor: item.isActive ? "#f0fdfa" : "transparent",
                        color: item.isActive ? "#0d9488" : "#475569",
                        "&:hover": {
                          bgcolor: item.isActive ? "#f0fdfa" : "#f8fafc",
                          color: item.isActive ? "#0d9488" : "#0f172a",
                          "& .MuiListItemIcon-root": {
                            color: item.isActive ? "#0d9488" : "#0f172a",
                          },
                        },
                        transition: "all 0.15s ease",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 38,
                          color: item.isActive ? "#0d9488" : "#64748b",
                          transition: "color 0.15s ease",
                        }}
                      >
                        <IconComponent sx={{ fontSize: 22 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: "0.925rem",
                          fontWeight: item.isActive ? 700 : 500,
                          letterSpacing: "-0.01em",
                        }}
                      />
                      {item.badgeCount !== undefined && (
                        <Chip
                          label={item.badgeCount}
                          size="small"
                          sx={{
                            height: 22,
                            minWidth: 22,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            bgcolor: "#0d9488",
                            color: "#ffffff",
                            borderRadius: "9999px",
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
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
          sx={{
            p: 2,
            bgcolor: "#fafbfc",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          {/* User Account Snippet */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.25,
              mb: 1.5,
              borderRadius: "12px",
              bgcolor: "#ffffff",
              border: "1px solid #f1f5f9",
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "#0f172a",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              JD
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}
                noWrap
              >
                John Doe
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}
                noWrap
              >
                Patient Account
              </Typography>
            </Box>
          </Box>

          {/* Action List */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <ListItemButton
              onClick={handleThemeToggle}
              sx={{
                borderRadius: "10px",
                py: 0.9,
                px: 1.5,
                color: "#475569",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                  color: "#0f172a",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: "#64748b" }}>
                {isDarkMode ? (
                  <LightModeOutlinedIcon sx={{ fontSize: 20 }} />
                ) : (
                  <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={isDarkMode ? "Light Mode" : "Dark Mode"}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#0d9488",
                  fontWeight: 700,
                  bgcolor: "#f0fdfa",
                  px: 1,
                  py: 0.25,
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                }}
              >
                {isDarkMode ? "ON" : "OFF"}
              </Typography>
            </ListItemButton>

            <ListItemButton
              onClick={() => handleNavClick("/profile")}
              sx={{
                borderRadius: "10px",
                py: 0.9,
                px: 1.5,
                color: "#475569",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                  color: "#0f172a",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: "#64748b" }}>
                <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: "10px",
                py: 0.9,
                px: 1.5,
                color: "#dc2626",
                "&:hover": {
                  bgcolor: "#fef2f2",
                  color: "#b91c1c",
                  "& .MuiListItemIcon-root": {
                    color: "#dc2626",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: "#dc2626" }}>
                <LogoutRoundedIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Sign Out"
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>
    </header>
  );
}
