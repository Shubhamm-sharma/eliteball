import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import logo from "../../../assets/Images/TeamLogos/Man_utd.jpg";

const CardService = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [servicesProvided, setServicesProvided] = useState([
    {
      heading: "Get Slots",
      desc: "Book Slots and Get Discounts",
      topContent: "",
    },
    {
      heading: "Join Tournaments",
      desc: "Participate in best tournaments in tricity",
      topContent: "",
    },
    { heading: "Services", desc: "Check Services we provide.", topContent: "" },
    {
      heading: "Ask a question ?",
      desc: "Having any trouble, discuss with us",
      topContent: "",
    },
    {
      heading: "Join Us",
      desc: "Passionate for football? Follow your passion by joining us.",
      topContent: "",
    },
    {
      heading: "Coacing/Academy Enquiry",
      desc: "Get Free counselling from our experts",
      topContent: "",
    },
  ]);

  return (
    <>
      <Row xxl={12} className="mt-4 d-flex flex-column align-items-center">
        <Col>
          <h2 className="defaultTextColorYellow">Services we provide</h2>
        </Col>
        <Col className="px-0">
          <Row xxl={12} className="d-flex justify-content-between">
            {servicesProvided?.map((ele) => {
              return (
                <Col xxl={4} className="my-3 cursorPointer">
                  <div class="container p-0">
                    <div class="card p-0">
                      <div class="slide slide1">
                        <div class="content">
                          <div class="icon">
                            <i class="fa fa-user-circle" aria-hidden="true"></i>
                          </div>
                        </div>
                      </div>
                      <div class="slide slide2">
                        <div class="content">
                          <h3>{ele?.heading}</h3>
                          <p>{ele?.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default CardService;
