import { create } from "zustand";
import {
  getAppointments,
  deleteAppointment as apiDeleteAppointment,
} from "../services/api";

/**
 * Checks if an appointment status is pending or upcoming (case-insensitive).
 * @param {string} status
 * @returns {boolean}
 */
export const isPendingOrUpcoming = (status) => {
  const s = String(status || "")
    .trim()
    .toLowerCase();
  return s === "upcoming" || s === "pending";
};

/**
 * Checks if an appointment status is cancelled (case-insensitive).
 * @param {string} status
 * @returns {boolean}
 */
export const isCancelled = (status) => {
  const s = String(status || "")
    .trim()
    .toLowerCase();
  return s === "cancelled" || s === "canceled";
};

/**
 * Checks if an appointment status is completed (case-insensitive).
 * @param {string} status
 * @returns {boolean}
 */
export const isCompleted = (status) => {
  const s = String(status || "")
    .trim()
    .toLowerCase();
  return s === "completed";
};

export const useAppointmentsStore = create((set, get) => ({
  appointments: [],
  loading: false,
  error: null,
  isInitialized: false,

  setAppointments: (appointments) => set({ appointments, isInitialized: true }),

  fetchAppointments: async () => {
    set({ loading: true });
    try {
      const res = await getAppointments();
      const data = Array.isArray(res.data) ? res.data : [];
      set({
        appointments: data,
        error: null,
        loading: false,
        isInitialized: true,
      });
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load appointments. Please ensure json-server is running on port 5000.";
      set({
        error: message,
        loading: false,
        isInitialized: true,
      });
      return [];
    }
  },

  addAppointment: (newApp) =>
    set((state) => ({
      appointments: [newApp, ...state.appointments],
    })),

  updateAppointmentInStore: (id, updatedFields) =>
    set((state) => ({
      appointments: state.appointments.map((app) =>
        String(app.id) === String(id) ? { ...app, ...updatedFields } : app,
      ),
    })),

  removeAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter(
        (app) => String(app.id) !== String(id),
      ),
    })),

  clearCancelledAppointments: async () => {
    const state = get();
    const cancelledApps = state.appointments.filter((a) =>
      isCancelled(a.status),
    );

    // Optimistically remove all cancelled appointments immediately from UI
    set({
      appointments: state.appointments.filter((a) => !isCancelled(a.status)),
    });

    // Execute DELETE on json-server for each cancelled appointment
    if (cancelledApps.length > 0) {
      await Promise.allSettled(
        cancelledApps.map((app) => apiDeleteAppointment(app.id)),
      );
    }
  },

  getPendingCount: () => {
    return get().appointments.filter((a) => isPendingOrUpcoming(a.status))
      .length;
  },
}));

export default useAppointmentsStore;
