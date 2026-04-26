import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import RegisterForm from "./RegisterForm/RegisterForm";
import poster_image from "../../assets/Images/Register/Poster_Register_Page_2.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SignUpModal from "./RegisterForm/Modal/SignUpModal";

const Register = () => {
  const store = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpModalMessage, setSignUpModalMessage] = useState("");
  console.log(store, "ckkkk");
  const loginReducer = store?.loginReducer;
  useEffect(() => {
    if (loginReducer?.user?.status == 200) {
      navigate("/");
    } else if (loginReducer?.error) {
      setShowSignUpModal(true);
      setSignUpModalMessage(loginReducer?.error);
    }
  }, [loginReducer]);
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
      <SignUpModal
        show={showSignUpModal}
        hide={() => setShowSignUpModal(false)}
        message={signUpModalMessage}
      />
    </Row>
  );
};

export default Register;
