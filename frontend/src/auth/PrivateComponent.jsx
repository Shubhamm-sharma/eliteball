import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateComponent = ({ Component }) => {
  const token = sessionStorage.getItem("token");
  const isAuthenticated = token ? true : false;
  return isAuthenticated ? <Component /> : <Navigate to={"/"} />;
};

export default PrivateComponent;
