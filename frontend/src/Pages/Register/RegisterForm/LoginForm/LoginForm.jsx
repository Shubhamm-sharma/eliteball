import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

const LoginForm = () => {
  const handleSubmit = () => {};
  return (
    <Row>
      <Col lg={10} className="">
        <h3 className="text-white">Login</h3>
      </Col>
      <Col lg={10}>
        <Form onSubmit={handleSubmit} className="mb-3">
          {/* Login form fields */}
          <Button type="submit" className="btn btn-outline-dark">
            Login
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default LoginForm;
