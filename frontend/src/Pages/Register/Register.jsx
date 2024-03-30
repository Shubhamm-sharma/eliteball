import React from "react";
import { Col, Row } from "react-bootstrap";
import RegisterForm from "./RegisterForm/RegisterForm";
import poster_image from "../../assets/Images/Register/Poster_Register_Page_2.jpeg";

const Register = () => {
  return (
    <Row lg={12} className="parentHomePage">
      <Col lg={7} xs={12} className="imageColumn p-0">
        {/* Image column */}
        <img src={poster_image} className="fullWidthImage" />
      </Col>
      <Col lg={5} xs={12} className="p-0">
        {/* Register Form column */}
        {/* Your register form component goes here */}
        <RegisterForm />
      </Col>
    </Row>
  );
};

export default Register;
