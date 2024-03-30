import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";

const RegisterForm = () => {
  const handleCheck = async () => {
    await axios.get(`${window.location.origin}/register`);
    console.log("ppp");
  };
  return (
    <Row className="d-flex parentRowRegisterForm py-4 justify-content-center">
      <Col
        className="registerFormParent d-flex align-items-center justify-content-center"
        lg={8}
      >
        <Row className="d-flex py-3 justify-content-center ">
          <Col lg={10} className="">
            <h3 className="text-white">Sign Up!</h3>
          </Col>
          <Col lg={10}>
            <Form className="mb-3">
              <Form.Group className="mb-2">
                <Form.Label className="text-white m-0">
                  First Name<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  className=""
                  type="text"
                  placeholder="Enter your First Name"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="text-white m-0">
                  Last Name<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  className=""
                  type="text"
                  placeholder="Enter your Last Name"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="text-white m-0">
                  Contact Number<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  className=""
                  type="text"
                  placeholder="Enter your Phone Number"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="text-white m-0">
                  Email<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  className=""
                  type="text"
                  placeholder="Enter your Email"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="text-white m-0">
                  Team Name<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  className=""
                  type="text"
                  placeholder="Enter your Team Name"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="text-white m-0">
                  Position<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  className=""
                  type="text"
                  placeholder="Enter your position in team"
                />
              </Form.Group>
              <Form.Group className="d-flex justify-content-center mt-4">
                <button
                  onClick={handleCheck}
                  type="button"
                  class="btn btn-outline-dark"
                >
                  Submit
                </button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default RegisterForm;
