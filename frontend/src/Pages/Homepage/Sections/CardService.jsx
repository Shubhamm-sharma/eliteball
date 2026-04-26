import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import logo from "../../../assets/Images/TeamLogos/Man_utd.jpg";
import { useNavigate } from "react-router-dom";

const CardService = () => {
  const navigate = useNavigate();
  const [servicesProvided, setServicesProvided] = useState([
    {
      heading: "Get Slots",
      desc: "Book Slots and Get Discounts",
      topContent: "",
      imagePath: "../src/assets/Images/CardsSection/GetSlots.jpeg",
    },
    {
      heading: "Join Tournaments",
      desc: "Participate in best tournaments in tricity",
      topContent: "",
      imagePath: "../src/assets/Images/CardsSection/Tournament.jpeg",
    },
    {
      heading: "Coacing/Academy Enquiry",
      desc: "Get Free counselling from our experts",
      topContent: "",
      imagePath: "../src/assets/Images/CardsSection/Academy.jpeg",
    },
    {
      heading: "Previous/Upcoming Fixtures",
      desc: "Check Previous results or upcoming matches",
      topContent: "",
      imagePath: "../src/assets/Images/CardsSection/UpcomingFixtures.jpeg",
    },
    {
      heading: "Our Services",
      desc: "Check Services we provide.",
      topContent: "",
      imagePath: "../src/assets/Images/CardsSection/OurServices.jpeg",
    },
    {
      heading: "Ask a question ?",
      desc: "Having any trouble, discuss with us",
      topContent: "",
      imagePath: "",
    },
  ]);
  const handleCardsNavigate = (ele) => {
    if (ele?.heading == "Get Slots") {
      navigate("/slots");
    }
  };
  return (
    <>
      <Row xxl={12} className="mt-4 d-flex flex-column align-items-center">
        <Col>
          <h2 className="basicHeading comic-neue-regular">Services we offer</h2>
        </Col>
        <Col className="px-0">
          <Row xxl={12} className="d-flex justify-content-between">
            {servicesProvided?.map((ele) => {
              return (
                <Col
                  onClick={() => handleCardsNavigate(ele)}
                  xxl={4}
                  className="my-3 cursorPointer"
                >
                  <div class="container p-0">
                    <div class="card p-0">
                      <div class="slide slide1">
                        <div class="content">
                          <div
                            style={{
                              backgroundImage: `url(${ele.imagePath})`,
                            }}
                            class="icon"
                          >
                            <i class="fa fa-user-circle" aria-hidden="true"></i>
                          </div>
                        </div>
                      </div>
                      <div class="slide slide2">
                        <div class="content">
                          <h3 className=" comic-neue-regular">
                            {ele?.heading}
                          </h3>
                          <p className="comic-neue-regular">{ele?.desc}</p>
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
