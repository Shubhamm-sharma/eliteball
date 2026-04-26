import React from "react";
import { Col, Row } from "react-bootstrap";
import { FaInstagram } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="footerParent">
      <Row className="text-center d-flex flex-column">
        <Col>
          <p className="copyright mt-2">©Eliteball - 2024</p>
        </Col>
        <Col className="">
          <h5>Social Handles</h5>
          <FaInstagram className="cp mx-2" size={"2em"} color="pink" />
          <FaYoutube className="cp" size={"2em"} color="red" />
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
