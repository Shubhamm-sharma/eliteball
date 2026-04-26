import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getMatches } from "../../../api/backendApi";
import {
  formatLiveTime,
  getMatchTeams,
  getShortName,
  getTeamName,
} from "../../../utils/matchDisplay";
import "./sections.css";

const LiveSection = () => {
  const [liveMatch, setLiveMatch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadLiveMatches = async () => {
      try {
        const data = await getMatches({ status: "live", limit: 5, sort: "asc" });
        if (isMounted) {
          setLiveMatch(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load live matches"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadLiveMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderLogo = (team, name) => {
    if (team?.logo) {
      return <img height={50} src={team.logo} alt={name} />;
    }

    return <span className="teamLogoFallback">{getShortName(name)}</span>;
  };

  return (
    <>
      <Row className="d-flex flex-column mt-4">
        <Col className="">
          <h2 className="basicHeading comic-neue-regular">Live Scores</h2>
        </Col>

        {loading && (
          <Col className="fixtureBlock comic-neue-regular p-3 mt-2 text-center">
            Loading live scores...
          </Col>
        )}

        {!loading && error && (
          <Col className="fixtureBlock comic-neue-regular p-3 mt-2 text-center">
            {error}
          </Col>
        )}

        {!loading && !error && liveMatch.length === 0 && (
          <Col className="fixtureBlock comic-neue-regular p-3 mt-2 text-center">
            No live matches right now.
          </Col>
        )}

        {!loading && !error && liveMatch?.map((match) => {
          const { homeTeam, awayTeam, homeScore, awayScore } =
            getMatchTeams(match);
          const homeName = getTeamName(homeTeam, "Home team");
          const awayName = getTeamName(awayTeam, "Away team");

          return (
            <Col
              key={match._id}
              xxl={12}
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="fixtureBlock cp mt-2"
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
                    {renderLogo(homeTeam, homeName)}
                  </Col>
                  <Col
                    as={"b"}
                    className="d-none d-sm-block comic-neue-regular"
                  >
                    {homeName}
                  </Col>

                  <Col
                    as={"b"}
                    className="d-md-none d-lg-none d-xl-none d-xxl-none d-sm-none d-xs-block comic-neue-regular"
                  >
                    {getShortName(homeName)}
                  </Col>

                  <Col
                    xxl={4}
                    xl={4}
                    md={4}
                    lg={4}
                    sm={4}
                    xs={4}
                    className="text-end comic-neue-regular"
                  >
                    {homeScore}
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
                  className="d-flex align-items-center comic-neue-regular"
                >
                  <Col
                    xxl={4}
                    xl={4}
                    lg={4}
                    md={4}
                    sm={4}
                    xs={4}
                    className=" comic-neue-regular"
                  >
                    {awayScore}
                  </Col>
                  <Col
                    as={"b"}
                    className="d-none d-sm-block text-end comic-neue-regular"
                  >
                    {awayName}
                  </Col>

                  <Col
                    as={"b"}
                    className="d-md-none d-lg-none d-xl-none d-xxl-none d-sm-none d-xs-block text-end comic-neue-regular"
                  >
                    {getShortName(awayName)}
                  </Col>
                  <Col xxl={2} xl={2} className="text-end d-none d-lg-block">
                    {renderLogo(awayTeam, awayName)}
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col as={"i"} className="text-center comic-neue-regular">
                  Time: {formatLiveTime(match)}
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
