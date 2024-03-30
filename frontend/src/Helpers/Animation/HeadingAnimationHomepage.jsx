import { Button, Col, Modal, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const HeadingAnimationHomepage = () => {
  const heading = "ELITE BALL";
  const [show, setShow] = useState(true);
  useEffect(() => {
    // setTimeout(() => {
    setShow(false);
    // }, 2500);
  }, []);
  const location = useLocation();
  return (
    <>
      {location?.pathname == "/" && (
        <Modal className="d-flex mt-5 justify-content-center " show={show}>
          <Row className="d-flex justify-content-center">
            {heading?.split("")?.map((ele) => {
              return (
                <span className="headingHomepage d-flex justify-content-center col-lg-1">
                  {ele}
                </span>
              );
            })}
          </Row>
        </Modal>
      )}
    </>
  );
};

export default HeadingAnimationHomepage;
