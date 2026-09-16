import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDoctors = () => apiClient.get("/doctors");
export const getDoctorById = (id) => apiClient.get(`/doctors/${id}`);

export default apiClient;