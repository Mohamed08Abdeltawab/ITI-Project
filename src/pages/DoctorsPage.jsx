import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Chip,
  Alert,
  Skeleton,
  Pagination,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import { getDoctors } from "../services/api";
import DoctorCard from "../components/DoctorCard";

const ITEMS_PER_PAGE = 6;

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, filter, sort & pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [sortBy, setSortBy] = useState("Top Rated");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch doctors list on mount
  useEffect(() => {
    let isMounted = true;
    getDoctors()
      .then((res) => {
        if (!isMounted) return;
        setDoctors(Array.isArray(res.data) ? res.data : []);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err.message ||
            "Failed to load doctors list. Please check your network.",
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Extract distinct specialties dynamically
  const specialties = useMemo(() => {
    const list = doctors.map((doc) => doc.specialty).filter(Boolean);
    const unique = Array.from(new Set(list));
    const desiredOrder = [
      "Cardiology",
      "Dermatology",
      "Pediatrics",
      "Orthopedics",
      "Neurology",
    ];
    const ordered = desiredOrder.filter((item) => unique.includes(item));
    const others = unique.filter((item) => !desiredOrder.includes(item));
    return ["All Specialties", ...ordered, ...others];
  }, [doctors]);

  // Filter & Sort
  const filteredAndSortedDoctors = useMemo(() => {
    let result = doctors.filter((doc) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        doc.name.toLowerCase().includes(query) ||
        doc.specialty.toLowerCase().includes(query) ||
        (doc.bio && doc.bio.toLowerCase().includes(query));

      const matchesSpecialty =
        selectedSpecialty === "All Specialties" ||
        doc.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });

    // Sorting logic
    result = [...result].sort((a, b) => {
      if (sortBy === "Top Rated") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "Most Experienced") {
        const expA = parseInt(a.experience, 10) || 0;
        const expB = parseInt(b.experience, 10) || 0;
        return expB - expA;
      }
      if (sortBy === "Name (A-Z)") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [doctors, searchTerm, selectedSpecialty, sortBy]);

  // Pagination calculation
  const totalPages =
    Math.ceil(filteredAndSortedDoctors.length / ITEMS_PER_PAGE) || 1;

  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedDoctors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedDoctors, currentPage]);

  const startIndex =
    filteredAndSortedDoctors.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredAndSortedDoctors.length,
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Hero Header Banner */}
      <Box
        sx={(theme) => ({
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(13, 148, 136, 0.15) 100%)"
              : "linear-gradient(135deg, #ffffff 0%, rgba(204, 251, 241, 0.5) 100%)",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "24px",
          p: { xs: 3, sm: 5 },
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          transition: "background-color 0.2s, border-color 0.2s",
        })}
      >
        <Box sx={{ maxWidth: 768 }}>
          <Chip
            icon={
              <ShieldRoundedIcon
                sx={{ fontSize: 16, "&&": { color: "primary.main" } }}
              />
            }
            label="CAREPOINT SPECIALIST NETWORK"
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
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              mb: 2,
            })}
          />

          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2.25rem" },
              fontWeight: 800,
              color: "text.primary",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
            }}
          >
            Find Trusted Doctors &amp; Book
            <Box component="br" sx={{ display: { xs: "none", sm: "inline" } }} /> Appointments
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 1.5,
              color: "text.secondary",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              lineHeight: 1.6,
              maxWidth: 576,
            }}
          >
            Connect with verified medical specialists, review credentials and
            real-time availability, and book your consultation instantly.
          </Typography>
        </Box>
      </Box>

      {/* Controlled Search Bar */}
      <Box>
        <TextField
          fullWidth
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by doctor name, symptom, or medical specialty..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: "text.secondary", fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
          sx={(theme) => ({
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              bgcolor: "background.paper",
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
          })}
        />
      </Box>

      {/* Specialty Filter Pills */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          overflowX: "auto",
          pb: 0.5,
          flexWrap: "wrap",
        }}
      >
        {specialties.map((spec) => {
          const isActive = selectedSpecialty === spec;
          return (
            <Chip
              key={spec}
              label={spec}
              clickable
              onClick={() => {
                setSelectedSpecialty(spec);
                setCurrentPage(1);
              }}
              sx={(theme) => ({
                height: 38,
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "0.875rem",
                transition: "all 0.2s",
                ...(isActive
                  ? {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }
                  : {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(30, 41, 59, 0.7)"
                          : "rgba(241, 245, 249, 0.8)",
                      color: theme.palette.text.secondary,
                      border: `1px solid ${theme.palette.divider}`,
                      "&:hover": {
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(51, 65, 85, 0.8)"
                            : "rgba(226, 232, 240, 0.8)",
                        color: theme.palette.text.primary,
                      },
                    }),
              })}
            />
          );
        })}
      </Box>

      {/* Meta Bar: Count + Verified Chip + Sort Dropdown */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
          pt: 1,
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center", gap: 1, fontSize: "0.875rem" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Showing {filteredAndSortedDoctors.length} doctors available
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            •
          </Typography>
          <Chip
            icon={
              <VerifiedUserRoundedIcon
                sx={{ fontSize: 15, "&&": { color: "success.main" } }}
              />
            }
            label="Verified Practitioners"
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
              fontWeight: 600,
              fontSize: "0.75rem",
            })}
          />
        </Stack>

        {/* Sort Select */}
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            gap: 1,
            alignSelf: { xs: "flex-end", sm: "auto" },
          }}
        >
          <FilterListRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Sort by:
          </Typography>
          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={(theme) => ({
                borderRadius: "12px",
                height: 38,
                bgcolor: "background.paper",
                color: "text.primary",
                fontWeight: 600,
                fontSize: "0.875rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.divider,
                },
              })}
            >
              <MenuItem value="Top Rated">Top Rated</MenuItem>
              <MenuItem value="Most Experienced">Most Experienced</MenuItem>
              <MenuItem value="Name (A-Z)">Name (A-Z)</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* Error Alert State */}
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshRoundedIcon />}
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
          sx={{ borderRadius: "16px" }}
        >
          {error}
        </Alert>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <Card
              key={idx}
              elevation={0}
              sx={(theme) => ({
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "16px",
                p: 2.5,
              })}
            >
              <CardContent
                sx={{
                  p: 0,
                  "&:last-child": { pb: 0 },
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Stack direction="row" sx={{ alignItems: "center", gap: 1.75 }}>
                  <Skeleton
                    variant="rounded"
                    width={56}
                    height={56}
                    sx={{ borderRadius: "16px" }}
                  />
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Skeleton variant="text" width="65%" height={24} />
                    <Skeleton variant="text" width="40%" height={18} />
                  </Box>
                </Stack>
                <Skeleton
                  variant="rounded"
                  width={90}
                  height={26}
                  sx={{ borderRadius: "8px" }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={40}
                  sx={{ borderRadius: "8px" }}
                />
                <Skeleton
                  variant="rounded"
                  width="80%"
                  height={24}
                  sx={{ borderRadius: "8px" }}
                />
                <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                  <Skeleton
                    variant="rounded"
                    width="50%"
                    height={38}
                    sx={{ borderRadius: "12px" }}
                  />
                  <Skeleton
                    variant="rounded"
                    width="50%"
                    height={38}
                    sx={{ borderRadius: "12px" }}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAndSortedDoctors.length === 0 && (
        <Card
          elevation={0}
          sx={(theme) => ({
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "24px",
            p: 5,
            textAlign: "center",
            maxWidth: 448,
            mx: "auto",
            my: 4,
          })}
        >
          <Box
            sx={(theme) => ({
              width: 56,
              height: 56,
              borderRadius: "16px",
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(13, 148, 136, 0.2)"
                  : "rgba(13, 148, 136, 0.1)",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            })}
          >
            <SearchOffRoundedIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            No doctors found
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: "0.875rem", mt: 0.5, mb: 2.5 }}
          >
            No medical specialists match your search criteria. Try adjusting
            your query or reset filters.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSearchTerm("");
              setSelectedSpecialty("All Specialties");
            }}
            sx={{
              fontWeight: 600,
              borderRadius: "12px",
              px: 2.5,
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Responsive Doctors Grid */}
      {!loading && !error && paginatedDoctors.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {paginatedDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </Box>
      )}

      {/* Pagination Controls */}
      {!loading && !error && filteredAndSortedDoctors.length > 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={(theme) => ({
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            pt: 3,
            pb: 4,
            borderTop: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Showing{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
              {startIndex}
            </Box>{" "}
            to{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
              {endIndex}
            </Box>{" "}
            of{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
              {filteredAndSortedDoctors.length}
            </Box>{" "}
            specialists
          </Typography>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            sx={(theme) => ({
              "& .MuiPaginationItem-root": {
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.85rem",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            })}
          />
        </Stack>
      )}
    </Box>
  );
}
