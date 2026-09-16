import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDoctors = () => apiClient.get("/doctors");
export const getDoctorById = (id) => apiClient.get(`/doctors/${id}`);
export const createAppointment = (appointmentData) =>
  apiClient.post("/appointments", appointmentData);
export const getAppointments = () => apiClient.get("/appointments");
export const updateAppointment = (id, data) =>
  apiClient.patch(`/appointments/${id}`, data);
export const deleteAppointment = (id) =>
  apiClient.delete(`/appointments/${id}`);

export default apiClient;
