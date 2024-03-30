import React from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  Link,
  Outlet,
  useParams,
} from "react-router-dom";
import Homepage from "../Pages/Homepage/Homepage";
import Fixtures from "../Pages/Fixtures/Fixtures";
import NoPageFound from "../Pages/NoPageFound/NoPageFound";
import Register from "../Pages/Register/Register";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Services from "../Pages/Services/Services";

const Routes = () => {
  const element = useRoutes([
    { path: "/", element: <Homepage /> },
    { path: "/fixtures", element: <Fixtures /> },
    { path: "/register", element: <Register /> },
    { path: "/aboutus", element: <AboutUs /> },
    { path: "/services", element: <Services /> },
    { path: "*", element: <NoPageFound /> },
  ]);
  return element;
};

export default Routes;
