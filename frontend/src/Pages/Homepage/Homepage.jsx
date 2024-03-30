import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import LiveSection from "./Sections/LiveSection";
import ButtonsForDifferentFunctions from "./Sections/ButtonsForDifferentFunctions";
import CardService from "./Sections/CardService";

const Homepage = () => {
  return (
    <Row className="d-flex parentHomePage justify-content-center">
      <Col xxl={10} xl={10} lg={10} md={10} sm={10} xs={10}>
        <LiveSection />
      </Col>
      <Col xxl={10} xl={10} lg={10} md={10} sm={10} xs={10}>
        <ButtonsForDifferentFunctions />
      </Col>
      <Col xxl={10} xl={10} lg={10} md={10} sm={10} xs={10}>
        <CardService />
      </Col>
    </Row>
  );
};

export default Homepage;
