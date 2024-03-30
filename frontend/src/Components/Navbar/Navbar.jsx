import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/Images/Logo/logo_main.jpeg";
import { RxHamburgerMenu } from "react-icons/rx";
import { GrNotification } from "react-icons/gr";
import { MdOutlineLightMode } from "react-icons/md";
import NotificationDropDown from "./Modals/NotificationDropDown";
import { useDispatch, useSelector } from "react-redux";
import { screen_mode_change_action } from "../../Redux/ScreenMode/action";

const Navbar = () => {
  const navigate = useNavigate();
  const [navElements, setNavElements] = useState([
    { linkName: "Home", linkPath: "/" },
    { linkName: "Fixtures", linkPath: "/fixtures" },
    { linkName: "Register", linkPath: "/register" },
    { linkName: "About Us", linkPath: "/aboutus" },
    { linkName: "Services", linkPath: "/services" },
  ]);
  const store = useSelector((state) => state);
  const dispatch = useDispatch();
  const [extraNavElements, setExtraNavElements] = useState([
    { iconName: <GrNotification />, name: "notification" },
    { iconName: <MdOutlineLightMode />, name: "mode" },
  ]);
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const Notifications = [
    {
      day: "Today",
      messages: [
        {
          id: 1,
          title: "Datacorp",
          subText: "Caleb Flakelar commented on Admin",
          time: "1 min ago",
          icon: "mdi mdi-comment-account-outline",
          variant: "primary",
          isRead: false,
        },
        {
          id: 2,
          title: "Admin",
          subText: "New user registered.",
          time: "1 hours ago",
          icon: "mdi mdi-account-plus",
          variant: "info",
          isRead: true,
        },
      ],
    },
    {
      day: "Yesterday",
      messages: [
        {
          id: 1,
          title: "Cristina Pride",
          subText: "Hi, How are you? What about our next meeting",
          time: "1 day ago",
          avatar: logo,
          isRead: true,
        },
      ],
    },
    {
      day: "30 Dec 2021",
      messages: [
        {
          id: 1,
          title: "Datacorp",
          subText: "Caleb Flakelar commented on Admin",
          icon: "mdi mdi-comment-account-outline",
          variant: "primary",
          isRead: true,
        },

        {
          id: 2,
          title: "Karen Robinson",
          subText: "Wow ! this admin looks good and awesome design",
          avatar: logo,
          isRead: true,
        },
      ],
    },
  ];
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  // const handleRightNavs = (navName) => {
  //   console.log(navName);
  //   if (navName == "notification") {
  //     setDropdownOpen(!dropdownOpen);
  //   } else if (navName == "mode") {
  //     // setTheme(!theme);
  //     console.log(navName);
  //     dispatch(screen_mode_change_action());
  //   }
  // };
  return (
    <>
      {/* Desktop View */}
      <Row
        xxl={12}
        xl={12}
        lg={12}
        md={12}
        className="navbarParent mx-0 py-3 d-none d-md-flex position-fixed"
      >
        <Col xxl={1} xs={6} sm={4} md={2} lg={1} xl={1} className="text-center">
          <img
            onClick={() => navigate("/")}
            height={40}
            src={logo}
            alt="Logo"
          />
        </Col>
        <Col
          xs={12}
          md={8}
          lg={9}
          xl={9}
          xxl={9}
          className="text-center d-flex flex-row"
        >
          {navElements?.map((ele, index) => (
            <NavLink
              key={index}
              to={ele.linkPath}
              className={({ isActive, isPending }) =>
                `navlinks text-decoration-none px-3 pt-2 ${
                  isPending ? "" : ""
                } ${isActive ? "navlinks_active px-3" : ""}`
              }
            >
              {ele.linkName}
            </NavLink>
          ))}
        </Col>
        <Col
          xxl={2}
          lg={2}
          xl={2}
          md={2}
          className="d-flex align-items-center justify-content-center"
        >
          <Row className="d-flex align-items-center">
            <Col>
              <label class="switch">
                <input type="checkbox" />
                <span class="slider"></span>
              </label>
            </Col>
            <Col className="navlinks text-decoration-none pb-2 px-3 cp pt-2">
              <GrNotification />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Mobile View */}
      <Row
        sm={12}
        xs={12}
        className="navbarParent position-fixed mx-0 py-3 d-flex d-md-none"
      >
        <Col xs={2} sm={2} className="text-center">
          <img
            onClick={() => navigate("/")}
            height={40}
            src={logo}
            alt="Logo"
          />
        </Col>
        <Col
          className="d-flex align-items-center justify-content-end"
          sm={9}
          xs={8}
        >
          <Row className="d-flex align-items-center">
            <Col>
              <label class="switch">
                <input type="checkbox" />
                <span class="slider"></span>
              </label>
            </Col>
            <Col className="navlinks text-decoration-none pb-2 px-3 cp pt-2">
              <GrNotification />
            </Col>
          </Row>
        </Col>
        <Col sm={1} xs={1} className="text-end mt-1">
          <div className="navbar-toggler" onClick={toggleMenu}>
            <RxHamburgerMenu size={"2rem"} color="white" />
          </div>
        </Col>
        <Col
          xs={12}
          className={`mobile-nav-links ${
            showMenu ? "show" : ""
          } d-flex flex-column`}
        >
          {navElements?.map((ele, index) => (
            <NavLink
              key={index}
              to={ele.linkPath}
              className="navlinks text-decoration-none text-center py-1 px-1"
            >
              {ele.linkName}
            </NavLink>
          ))}
        </Col>
      </Row>
      <NotificationDropDown
        dropdownOpen={dropdownOpen}
        notifications={Notifications}
      />
    </>
  );
};

export default Navbar;
