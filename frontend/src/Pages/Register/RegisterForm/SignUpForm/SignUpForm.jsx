import React, { useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginAction } from "../../../../Redux/Auth/action";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import "../../register.css";

const SignUpForm = () => {
  const [selectedTeamPosition, setSelectedTeamPosition] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showTeamPosition, setShowTeamPosition] = useState(false);
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    dispatch(loginAction(data));
  };
  return (
    <>
      <Row className="justify-content-center">
        <Col lg={10} className="">
          <h3 className="text-white">Sign Up!</h3>
        </Col>
        <Col lg={10}>
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-3">
            <Form.Group className="mb-2">
              <Form.Label className="text-white m-0">
                First Name<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                className=""
                type="text"
                placeholder="Enter your First Name"
                {...register("firstName", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                })}
              />
              {errors.firstName && (
                <span className="text-light ">{errors.firstName.message}</span>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="text-white m-0">
                Last Name<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                className=""
                type="text"
                placeholder="Enter your Last Name"
                {...register("lastName", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                })}
              />
              {errors.lastName && (
                <span className="text-light">{errors.lastName.message}</span>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="text-white m-0">
                Contact Number<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                className=""
                type="text"
                maxLength={10}
                placeholder="Enter your Phone Number"
                {...register("phoneNumber", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Invalid Phone number",
                  },
                })}
              />
              {errors.phoneNumber && (
                <span className="text-light">{errors.phoneNumber.message}</span>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="text-white m-0">
                Username<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                className=""
                type="text"
                placeholder="Enter your Username"
                {...register("username", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                })}
              />
              {errors.username && (
                <span className="text-light ">{errors.username.message}</span>
              )}
            </Form.Group>
            <Form.Group className="mb-2 position-relative">
              <Form.Label className="text-white m-0">
                Password<span className="text-danger">*</span>
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  className="border-end-0 pr-5"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@\W_]).{8,16}$/,
                      message:
                        "Password must be 8 to 16 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (including @)",
                    },
                  })}
                />
                <button
                  className="btn position-absolute top-50 end-0 translate-middle-y border-0 "
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
                </button>
              </div>
              {errors.password && (
                <span
                  className={`text-light ${
                    errors.password.type == "pattern" && "fst-italic"
                  }`}
                >
                  {errors.password.message}
                </span>
              )}
            </Form.Group>
            {/* <Form.Group className="mb-2">
              <Form.Label className="text-white m-0">
                Email<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                className=""
                type="text"
                placeholder="Enter your Email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email",
                  },
                })}
              />
              {errors.email && (
                <span className="text-light">{errors.email.message}</span>
              )}
            </Form.Group> */}
            {/* <Form.Group className="mb-2">
              <Form.Label className="text-white m-0">
                Team Name<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                className=""
                type="text"
                placeholder="Enter your Team Name"
                {...register("teamName", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                })}
              />
              {errors.teamName && (
                <span className="text-light">{errors.teamName.message}</span>
              )}
            </Form.Group> */}
            <Form.Group className="mb-2">
              <span className="text-light">
                Prefered Position -{" "}
                {selectedTeamPosition == "" ? (
                  <button
                    onClick={() => setShowTeamPosition(true)}
                    type="button"
                    className="p-1"
                  >
                    Select
                  </button>
                ) : (
                  "LB"
                )}{" "}
              </span>
            </Form.Group>
            <Form.Group className="d-flex justify-content-center mt-4">
              <button type="submit" class="btn btn-outline-dark">
                Submit
              </button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default SignUpForm;
