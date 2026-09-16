import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// Doctor Endpoints
// ==========================================
export const getDoctors = () => apiClient.get("/doctors");
export const getDoctorById = (id) => apiClient.get(`/doctors/${id}`);

// ==========================================
// Appointments CRUD Endpoints
// ==========================================

// Read (All): GET /appointments
export const getAppointments = () => apiClient.get("/appointments");

// Read (Single): GET /appointments/:id
export const getAppointmentById = (id) => apiClient.get(`/appointments/${id}`);

// Create: POST /appointments
export const createAppointment = (appointmentData) =>
  apiClient.post("/appointments", appointmentData);

// Update: PATCH /appointments/:id (or PUT)
export const updateAppointment = (id, updatedData) =>
  apiClient.patch(`/appointments/${id}`, updatedData);

// Delete: DELETE /appointments/:id
export const deleteAppointment = (id) =>
  apiClient.delete(`/appointments/${id}`);

export default apiClient;
