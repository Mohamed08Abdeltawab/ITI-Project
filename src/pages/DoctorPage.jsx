import { useEffect, useState, useMemo } from "react";
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

  useEffect(() => {
    setLoading(true);
    getDoctors()
      .then((res) => {
        setDoctors(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load doctors list.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Extract distinct specialties dynamically
  const specialties = useMemo(() => {
    const list = doctors.map((doc) => doc.specialty).filter(Boolean);
    const unique = Array.from(new Set(list));
    // Prioritize specialties from screenshot order if present
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

    // Sorting
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
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-white via-white to-[#e6f7f5] border border-slate-200/90 rounded-[28px] p-6 sm:p-10 relative overflow-hidden shadow-xs">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-[#0d9488] bg-[#e6f7f5] border border-[#a7f3d0]/60 mb-4">
            <svg
              className="w-3.5 h-3.5 text-[#0d9488]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>CAREPOINT SPECIALIST NETWORK</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-[38px] font-extrabold text-slate-900 tracking-tight leading-[1.2]">
            Find Trusted Doctors &amp; Book
            <br className="hidden sm:inline" /> Appointments
          </h1>

          {/* Subheading */}
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
            Connect with verified medical specialists, check real-time
            availability, and book your consultation instantly.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by doctor name, symptom, or medical specialty..."
          className="w-full bg-white border border-slate-200/90 rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 text-sm sm:text-base transition-all shadow-xs"
        />
      </div>

      {/* Specialty Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar flex-wrap">
        {specialties.map((spec) => {
          const isActive = selectedSpecialty === spec;
          return (
            <button
              key={spec}
              type="button"
              onClick={() => {
                setSelectedSpecialty(spec);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0d9488] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {spec}
            </button>
          );
        })}
      </div>

      {/* Meta Bar: Count + Verified pill + Sort dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-slate-800">
            Showing {filteredAndSortedDoctors.length} doctors available
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <svg
              className="w-3.5 h-3.5 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Verified Practitioners
          </span>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-sm">
          <span className="text-slate-500 font-normal">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer shadow-xs"
            >
              <option value="Top Rated">Top Rated</option>
              <option value="Most Experienced">Most Experienced</option>
              <option value="Name (A-Z)">Name (A-Z)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="text-xs font-semibold underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-[22px] p-6 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-10 bg-slate-100 rounded w-full" />
              <div className="h-6 bg-slate-100 rounded w-2/3" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="h-10 bg-slate-200 rounded-xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAndSortedDoctors.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0d9488] flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No doctors found
          </h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            No specialists match your search criteria. Try adjusting your search
            term or specialty filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedSpecialty("All Specialties");
            }}
            className="px-4 py-2 bg-[#0d9488] text-white text-xs font-semibold rounded-xl hover:bg-[#0f766e] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Doctors Grid (3 Columns) */}
      {!loading && !error && paginatedDoctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && filteredAndSortedDoctors.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-8 border-t border-slate-100">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Showing{" "}
            <span className="font-bold text-slate-800">{startIndex}</span> to{" "}
            <span className="font-bold text-slate-800">{endIndex}</span> of{" "}
            <span className="font-bold text-slate-800">
              {filteredAndSortedDoctors.length}
            </span>{" "}
            specialists
          </p>

          <div className="flex items-center gap-1.5">
            {/* Previous */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 1
                  ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50/50"
                  : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>Previous</span>
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0d9488] text-white shadow-xs"
                        : "border border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              },
            )}

            {/* Next */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                currentPage === totalPages
                  ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50/50"
                  : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
              }`}
            >
              <span>Next</span>
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
