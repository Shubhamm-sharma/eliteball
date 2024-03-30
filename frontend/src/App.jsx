import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Index from "./Routes/Index";
import Navbar from "./Components/Navbar/Navbar";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Index />
      </Router>
    </>
  );
}

export default App;
