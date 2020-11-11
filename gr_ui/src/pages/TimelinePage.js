import React from "react";
import { compose, withState, withProps } from "recompose";
import { Nav, NavItem } from "react-bootstrap";
import gql from "graphql-tag";

import sum from "../helpers/sum";
import moment from "../helpers/moment";
import withData from "../helpers/withData";

import Kilometers from "../components/Kilometers";
import Team from "../components/Team";
import Rank from "../components/Rank";

const TimelinePage = compose(
  withData(gql`
    query {
      weeks {
        id
        start_day
        end_day
      }
      all_teams {
        id
        week_hundreds
        users {
          id
          week_hundreds
        }
      }
    }
  `),
  withState("currentWeekIndex", "setCurrentWeekIndex", 0),
  withProps(({ currentWeekIndex, data }) => ({
    currentWeek: data.weeks[currentWeekIndex]
  }))
)(({ data, currentWeek, currentWeekIndex, setCurrentWeekIndex }) => (
  <>
    <Nav bsStyle="tabs">
      {data.weeks.map((week, weekIndex) => (
        <NavItem
          active={currentWeekIndex === weekIndex}
          key={week.id}
          onClick={event => {
            event.preventDefault();

            setCurrentWeekIndex(weekIndex);
          }}
        >
          {moment(week.start_day).format("MMMDo")} ~{" "}
          {moment(week.end_day).format("MMMDo")}
        </NavItem>
      ))}
    </Nav>
    <h2 style={{ textAlign: "center" }}>
      {moment(currentWeek.start_day).format("MMMDo")} ~{" "}
      {moment(currentWeek.end_day).format("MMMDo")}
    </h2>
    <div
      style={{
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
        alignItems: "flex-start"
      }}
    >
      {data.all_teams.map(team => (
        <div
          key={team.id}
          style={{
            width: 240,
            margin: 5,
            flex: "1 0 auto"
          }}
        >
          <Team
            id={team.id}
            header={
              <div>
                <span style={{ fontSize: 20 }}>
                  <Kilometers hundreds={team.week_hundreds[currentWeekIndex]} />
                </span>
                <br />
                该周累积里程:
                <Kilometers
                  hundreds={sum(
                    team.week_hundreds.slice(0, currentWeekIndex + 1)
                  )}
                />
              </div>
            }
          >
            <Rank
              users={team.users}
              rankBy={user => user.week_hundreds[currentWeekIndex]}
            />
          </Team>
        </div>
      ))}
    </div>
  </>
));

export default TimelinePage;
