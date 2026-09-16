import { useState } from "react";
import { useNavigate } from "react-router";

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Derive schedule string if not directly present
  const scheduleText =
    doctor.workingSchedule ||
    (Array.isArray(doctor.workingDays) && doctor.workingDays.length > 0
      ? `${doctor.workingDays[0]} - ${
          doctor.workingDays[doctor.workingDays.length - 1]
        } (09:00 - 18:00)`
      : "Mon - Thu (09:00 - 18:00)");

  return (
    <div className="bg-white border border-slate-200/90 hover:border-teal-200 hover:shadow-lg transition-all duration-250 rounded-[22px] p-5 sm:p-6 flex flex-col justify-between h-full group">
      <div>
        {/* Top row: Avatar + Info + Favorite */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar with active green dot */}
            <div className="relative shrink-0">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-14 h-14 rounded-2xl object-cover bg-slate-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=400";
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* Name + Specialty & Experience */}
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-[15px] sm:text-base leading-tight truncate">
                {doctor.name}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-[#f0fdfa] text-[#0d9488] border border-[#ccfbf1]">
                  {doctor.specialty}
                </span>
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                  {doctor.experience || "10 yrs exp"}
                </span>
              </div>
            </div>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={() => setIsFavorite((prev) => !prev)}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
              isFavorite
                ? "bg-red-50 border-red-200 text-red-500"
                : "bg-slate-50/80 border-slate-200/60 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            }`}
            aria-label="Add to favorites"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        </div>

        {/* Rating badge */}
        <div className="inline-flex items-center gap-1.5 bg-slate-50/80 border border-slate-100 rounded-lg px-2.5 py-1 mt-3 mb-2.5">
          <svg
            className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="font-bold text-slate-900 text-xs">
            {doctor.rating}
          </span>
          <span className="text-slate-400 text-xs font-normal">
            ({doctor.reviewsCount || 124} reviews)
          </span>
        </div>

        {/* Bio description */}
        <p className="text-slate-600 text-xs sm:text-[13px] line-clamp-2 leading-relaxed mb-3.5">
          {doctor.bio}
        </p>

        {/* Schedule / Hours pill */}
        <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-150 text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg mb-5">
          <span className="text-sm">🗓️</span>
          <span className="truncate">{scheduleText}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => navigate(`/doctors/${doctor.id}`)}
          className="w-full py-2.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl transition-colors text-center cursor-pointer"
        >
          View Profile
        </button>

        <button
          type="button"
          onClick={() => navigate(`/book/${doctor.id}`)}
          className="w-full py-2.5 px-3 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors text-center cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
