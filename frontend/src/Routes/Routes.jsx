import React from "react";
import { useRoutes } from "react-router-dom";
import Homepage from "../Pages/Homepage/Homepage";
import Fixtures from "../Pages/Fixtures/Fixtures";
import NoPageFound from "../Pages/NoPageFound/NoPageFound";
import Register from "../Pages/Register/Register";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Services from "../Pages/Services/Services";
import BookSlot from "../Pages/Homepage/Cards/BookSlot/BookSlot";
import PrivateComponent from "../auth/PrivateComponent";

const Routes = () => {
  const isAuthenticated = !!sessionStorage.getItem("token");

  const element = useRoutes([
    { path: "/", element: <Homepage /> },
    { path: "/fixtures", element: <Fixtures /> },
    { path: "/register", element: <Register /> },
    { path: "/aboutus", element: <AboutUs /> },
    { path: "/services", element: <Services /> },
    { path: "/slots", element: <BookSlot /> },
    { path: "*", element: <NoPageFound /> },
  ]);
  return element;
};

export default Routes;
