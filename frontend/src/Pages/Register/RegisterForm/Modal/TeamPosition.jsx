import React, { useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { IoShirt, IoShirtOutline } from "react-icons/io5";
import "../../register.css";

const positions = [
  ["LW", "ST", "RW"],
  ["LM", "CM", "RM"],
  ["LB", "CB", "CB", "RB"],
  ["GK"],
];

const TeamPosition = ({ show, hide }) => {
  const [selectedPosition, setSelectedPosition] = useState([-1, -1]);

  const handleClick = (rowIndex, colIndex) => {
    setSelectedPosition([rowIndex, colIndex]);
  };

  return (
    <Modal show={show} size="sm" onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>Choose Position</Modal.Title>
      </Modal.Header>
      <Modal.Body>Choose your preferred position in your team</Modal.Body>
      <Modal.Body className="football-field">
        {positions.map((row, rowIndex) => (
          <Row key={rowIndex} className="my-4">
            {row.map((position, colIndex) => (
              <Col
                key={colIndex}
                className="text-center d-flex flex-column justify-content-center align-items-center"
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {selectedPosition[0] === rowIndex &&
                selectedPosition[1] === colIndex ? (
                  <IoShirtOutline className="cp" size={"2em"} />
                ) : (
                  <IoShirt className="cp" size={"2em"} />
                )}
                <span>{position}</span>
              </Col>
            ))}
          </Row>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default TeamPosition;
