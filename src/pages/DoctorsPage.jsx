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
    <Box className="space-y-6">
      {/* Hero Header Banner */}
      <Box className="bg-gradient-to-r from-white via-white to-teal-50/60 dark:from-slate-800 dark:via-slate-800 dark:to-teal-950/40 border border-slate-200/90 dark:border-slate-700/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xs transition-colors">
        <Box className="max-w-3xl">
          <Chip
            icon={
              <ShieldRoundedIcon
                sx={{ fontSize: 16, "&&": { color: "#0d9488" } }}
              />
            }
            label="CAREPOINT SPECIALIST NETWORK"
            size="small"
            className="bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/70 font-bold tracking-wider uppercase text-xs mb-4"
          />

          <Typography
            variant="h3"
            component="h1"
            className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            Find Trusted Doctors &amp; Book
            <br className="hidden sm:inline" /> Appointments
          </Typography>

          <Typography
            variant="body1"
            className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl"
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
                <SearchRoundedIcon sx={{ color: "#94a3b8", fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              bgcolor: "background.paper",
            },
          }}
        />
      </Box>

      {/* Specialty Filter Pills */}
      <Box className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-wrap">
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
              className={`rounded-xl text-sm font-semibold transition-all py-1.5 px-1 ${
                isActive
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
              }`}
              sx={{
                height: 38,
                "&.MuiChip-root": {
                  borderRadius: "12px",
                },
              }}
            />
          );
        })}
      </Box>

      {/* Meta Bar: Count + Verified Chip + Sort Dropdown */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        className="items-start sm:items-center justify-between gap-3 pt-2"
      >
        <Stack direction="row" className="items-center gap-2 text-sm">
          <Typography
            variant="body2"
            className="font-semibold text-slate-800 dark:text-slate-200"
          >
            Showing {filteredAndSortedDoctors.length} doctors available
          </Typography>
          <Typography
            variant="body2"
            className="text-slate-300 dark:text-slate-600"
          >
            •
          </Typography>
          <Chip
            icon={
              <VerifiedUserRoundedIcon
                sx={{ fontSize: 15, "&&": { color: "#10b981" } }}
              />
            }
            label="Verified Practitioners"
            size="small"
            className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 font-semibold text-xs"
          />
        </Stack>

        {/* Sort Select */}
        <Stack
          direction="row"
          className="items-center gap-2 self-end sm:self-auto"
        >
          <FilterListRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <Typography
            variant="caption"
            className="text-slate-500 dark:text-slate-400 font-medium"
          >
            Sort by:
          </Typography>
          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200"
              sx={{
                borderRadius: "12px",
                height: 38,
              }}
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
          className="rounded-2xl border border-red-200"
        >
          {error}
        </Alert>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <Card
              key={idx}
              elevation={0}
              className="border border-slate-200/80 rounded-2xl p-5"
            >
              <CardContent className="p-0 space-y-4">
                <Stack direction="row" className="items-center gap-3.5">
                  <Skeleton
                    variant="rounded"
                    width={56}
                    height={56}
                    className="rounded-2xl"
                  />
                  <Box className="flex-1 space-y-2">
                    <Skeleton variant="text" width="65%" height={24} />
                    <Skeleton variant="text" width="40%" height={18} />
                  </Box>
                </Stack>
                <Skeleton
                  variant="rounded"
                  width={90}
                  height={26}
                  className="rounded-lg"
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={40}
                  className="rounded-lg"
                />
                <Skeleton
                  variant="rounded"
                  width="80%"
                  height={24}
                  className="rounded-lg"
                />
                <Stack direction="row" spacing={2} className="pt-2">
                  <Skeleton
                    variant="rounded"
                    width="50%"
                    height={38}
                    className="rounded-xl"
                  />
                  <Skeleton
                    variant="rounded"
                    width="50%"
                    height={38}
                    className="rounded-xl"
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
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 text-center max-w-md mx-auto my-8"
        >
          <Box className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4">
            <SearchOffRoundedIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            variant="h6"
            className="font-bold text-slate-800 dark:text-white"
          >
            No doctors found
          </Typography>
          <Typography
            variant="body2"
            className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-5"
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
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl px-5"
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Responsive Doctors Grid */}
      {!loading && !error && paginatedDoctors.length > 0 && (
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </Box>
      )}

      {/* Pagination Controls */}
      {!loading && !error && filteredAndSortedDoctors.length > 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          className="items-center justify-between gap-4 pt-6 pb-8 border-t border-slate-100 dark:border-slate-800"
        >
          <Typography
            variant="body2"
            className="text-slate-500 dark:text-slate-400 font-medium"
          >
            Showing{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {startIndex}
            </span>{" "}
            to{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {endIndex}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {filteredAndSortedDoctors.length}
            </span>{" "}
            specialists
          </Typography>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.85rem",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#0d9488",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#0f766e",
                },
              },
            }}
          />
        </Stack>
      )}
    </Box>
  );
}
