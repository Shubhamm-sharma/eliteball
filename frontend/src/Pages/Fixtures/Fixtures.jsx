import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getMatches } from "../../api/backendApi";
import {
  formatLiveTime,
  formatMatchTime,
  getMatchTeams,
  getShortName,
  getTeamName,
} from "../../utils/matchDisplay";
import "./Fixtures.css";

const Fixtures = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadFixtures = async () => {
      try {
        setLoading(true);
        const data = await getMatches({ status: "all", limit: 50, sort: "asc" });
        if (isMounted) {
          setMatches(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load fixtures from backend"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFixtures();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderTeamLogo = (team, name) => {
    if (team?.logo) {
      return <img className="fixtureTeamLogo" src={team.logo} alt={name} />;
    }

    return (
      <span className="fixtureTeamLogo fixtureLogoFallback">
        {getShortName(name)}
      </span>
    );
  };

  return (
    <Row className="fixturesPage justify-content-center">
      <Col xxl={10} xl={10} lg={10} md={11} sm={11} xs={11}>
        <div className="fixturesHeader mb-4">
          <h1 className="comic-neue-regular mb-2">Fixtures</h1>
          <p className="fixturesSubtitle comic-neue-regular">
            Matches loaded directly from the backend API.
          </p>
        </div>

        {loading && (
          <div className="fixturesStatus comic-neue-regular">Loading fixtures...</div>
        )}

        {!loading && error && (
          <div className="fixturesStatus comic-neue-regular">{error}</div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="fixturesStatus comic-neue-regular">
            No fixtures found yet.
          </div>
        )}

        {!loading &&
          !error &&
          matches.map((match) => {
            const { homeTeam, awayTeam, homeScore, awayScore } =
              getMatchTeams(match);
            const homeName = getTeamName(homeTeam, "Home team");
            const awayName = getTeamName(awayTeam, "Away team");

            return (
              <div className="fixtureCard p-3 mb-3" key={match._id}>
                <Row className="align-items-center gy-3">
                  <Col md={4} xs={12} className="d-flex align-items-center gap-3">
                    {renderTeamLogo(homeTeam, homeName)}
                    <span className="fixtureTeamName comic-neue-regular">
                      {homeName}
                    </span>
                  </Col>

                  <Col md={4} xs={12} className="text-center">
                    <div className="fixtureScore comic-neue-regular">
                      {homeScore} - {awayScore}
                    </div>
                    <div className="fixtureMeta comic-neue-regular">
                      {match.status} | {formatLiveTime(match)}
                    </div>
                    <div className="fixtureMeta comic-neue-regular">
                      {formatMatchTime(match.startTime)}
                    </div>
                  </Col>

                  <Col
                    md={4}
                    xs={12}
                    className="d-flex align-items-center justify-content-md-end gap-3"
                  >
                    <span className="fixtureTeamName comic-neue-regular">
                      {awayName}
                    </span>
                    {renderTeamLogo(awayTeam, awayName)}
                  </Col>
                </Row>
              </div>
            );
          })}
      </Col>
    </Row>
  );
};

export default Fixtures;
