import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";

// Import Standardized Pages
import DoctorsPage from "../pages/DoctorsPage";
import DoctorDetailsPage from "../pages/DoctorDetailsPage";
import BookAppointmentPage from "../pages/BookAppointmentPage";
import AppointmentsPage from "../pages/AppointmentsPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DoctorsPage />,
      },
      {
        path: "doctors",
        element: <DoctorsPage />,
      },
      {
        path: "doctors/:id",
        element: <DoctorDetailsPage />,
      },
      {
        path: "book/:doctorId?",
        element: <BookAppointmentPage />,
      },
      {
        path: "appointments",
        element: <AppointmentsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
