import React from "react";
import { Col, Row } from "react-bootstrap";

const ButtonsForDifferentFunctions = () => {
  return (
    <>
      <Row xxl={10} xl={10} lg={10} md={10} sm={10} xs={10} className="mt-4">
        <Col
          xxl={3}
          xl={3}
          lg={3}
          md={3}
          sm={3}
          xs={12}
          className="d-flex justify-content-start"
        >
          <button className="buttonHomePage py-2 text-white">
            Previous Results
          </button>
        </Col>
        <Col
          xxl={3}
          xl={3}
          lg={3}
          md={3}
          sm={3}
          xs={12}
          className="d-flex justify-content-start"
        >
          <button className="buttonHomePage py-2 text-white">
            Upcoming Fixtures
          </button>
        </Col>
        <Col
          xxl={3}
          xl={3}
          lg={3}
          md={3}
          sm={3}
          xs={12}
          className="d-flex justify-content-start"
        >
          <button className="buttonHomePage text-white py-2 text-white">
            Upcoming Events
          </button>
        </Col>
        <Col
          xxl={3}
          xl={3}
          lg={3}
          md={3}
          sm={3}
          xs={12}
          className="d-flex justify-content-start"
        >
          <button className="buttonHomePage py-2 text-white">
            Organize Tournaments with Us
          </button>
        </Col>
      </Row>
    </>
  );
};

export default ButtonsForDifferentFunctions;
