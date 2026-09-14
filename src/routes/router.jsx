//
import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";

//import pages
import DoctorPage from "../pages/DoctorPage";
import DotorDetailsPage from "../pages/DotorDetailsPage";
import BookAppointmentPage from "../pages/BookAppointmentPage";
import AppointmentPage from "../pages/AppointmentPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DoctorPage />,
      },
      {
        path: "doctors",
        element: <DoctorPage />,
      },
      {
        path: "doctors/:is",
        element: <DotorDetailsPage />,
      },
      {
        path: "book/:doctorId?",
        element: <BookAppointmentPage />,
      },
      {
        path: "appointments",
        element: <AppointmentPage />,
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
