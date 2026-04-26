import React, { useState } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import TeamPosition from "./Modal/TeamPosition";
import SignUpForm from "./SignUpForm/SignUpForm";
import LoginForm from "./LoginForm/LoginForm";

const RegisterForm = () => {
  const [showTeamPosition, setShowTeamPosition] = useState(false);
  const [activeTab, setActiveTab] = useState("signup"); // State to track active tab

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <Row className="d-flex parentRowRegisterForm py-4 justify-content-center">
        <Col
          className="registerFormParent d-flex flex-column align-items-center justify-content-center position-relative"
          lg={8}
        >
          {/* Navigation toggle */}
          <nav className=" w-100 position-absolute top-0 start-50 translate-middle-x">
            <div
              className="nav nav-tabs pb-0 d-flex justify-content-between"
              id="nav-tab"
              role="tablist"
            >
              {/* Toggle between sign up and login tabs */}
              <button
                className={`nav-link ${
                  activeTab === "signup" ? "active" : ""
                } flex-grow-1`}
                id="nav-home-tab"
                onClick={() => setActiveTab("signup")}
                type="button"
                role="tab"
                aria-controls="nav-home"
                aria-selected={activeTab === "signup"}
              >
                Sign Up
              </button>
              <button
                className={`nav-link ${
                  activeTab === "login" ? "active" : "text-white"
                } flex-grow-1`}
                id="nav-profile-tab"
                onClick={() => setActiveTab("login")}
                type="button"
                role="tab"
                aria-controls="nav-profile"
                aria-selected={activeTab === "login"}
              >
                Login
              </button>
            </div>
          </nav>

          {/* Main content */}
          <Row className="d-flex justify-content-center mt-5">
            {activeTab === "signup" && <SignUpForm />}
            {activeTab === "login" && <LoginForm />}
          </Row>
        </Col>
      </Row>
      <TeamPosition
        show={showTeamPosition}
        hide={() => setShowTeamPosition(false)}
      />
    </>
  );
};

export default RegisterForm;
