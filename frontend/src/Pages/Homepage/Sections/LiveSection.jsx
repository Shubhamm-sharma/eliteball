import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Man_utd_logo from "../../../assets/Images/TeamLogos/Man_utd.jpg";
import arsenal_logo from "../../../assets/Images/TeamLogos/arsenal.jpg";

const LiveSection = () => {
  const [liveMatch, setLiveMatch] = useState([1, 2]);
  return (
    <>
      <Row className="d-flex flex-column mt-4">
        <Col className="defaultTextColorYellow">
          <h2>Live Scores</h2>
        </Col>
        {liveMatch?.map(() => {
          return (
            <Col
              xxl={12}
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="fixtureBlock mt-2"
            >
              {/* Full */}
              <Row className="p-3">
                {/* Indivisual Team 1 */}
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="d-flex align-items-center"
                >
                  <Col xxl={2} xl={2} className="d-none d-lg-block">
                    <img height={50} src={Man_utd_logo} />
                  </Col>
                  <Col as={"b"} className="d-none d-sm-block">
                    Manchester United
                  </Col>

                  <Col
                    as={"b"}
                    className="d-md-none d-lg-none d-xl-none d-xxl-none d-sm-none d-xs-block"
                  >
                    MAN UTD
                  </Col>

                  <Col
                    xxl={4}
                    xl={4}
                    md={4}
                    lg={4}
                    sm={4}
                    xs={4}
                    className="text-end"
                  >
                    0
                  </Col>
                </Col>
                {/* Indivisual Team 2 */}
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="d-flex align-items-center"
                >
                  <Col xxl={4} xl={4} lg={4} md={4} sm={4} xs={4} className="">
                    0
                  </Col>
                  <Col as={"b"} className="d-none d-sm-block text-end">
                    Arsenal
                  </Col>

                  <Col
                    as={"b"}
                    className="d-md-none d-lg-none d-xl-none d-xxl-none d-sm-none d-xs-block text-end"
                  >
                    ARS
                  </Col>
                  <Col xxl={2} xl={2} className="text-end d-none d-lg-block">
                    <img height={50} src={arsenal_logo} />
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col as={"i"} className="text-center">
                  Time: 55'
                </Col>
              </Row>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default LiveSection;
