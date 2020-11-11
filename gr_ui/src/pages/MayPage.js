import React from "react";
import { compose } from "recompose";
import { Alert } from "react-bootstrap";
import gql from "graphql-tag";

import moment from "../helpers/moment";
import withData from "../helpers/withData";

import Team from "../components/Team";
import User from "../components/User";
import Kilometers from "../components/Kilometers";
import Record from "../components/Record";

export default compose(
  withData(gql`
    query {
      all_teams {
        id
        month_total_hundreds
        day_total_hundreds
      }
      month
      all_day_records {
        id
        user {
          id
        }
        team {
          id
        }
      }
    }
  `)
)(({ data }) => (
  <>
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
          <a href={`/team/${team.id}`}>
            <Team
              id={team.id}
              header={
                <div>
                  <span style={{ fontSize: 20 }}>
                    <Kilometers hundreds={team.month_total_hundreds} />
                  </span>
                  {moment().isSame(data.month, "month") && (
                    <>
                      <br />
                      今天累积里程:
                      <Kilometers hundreds={team.day_total_hundreds} />
                    </>
                  )}
                </div>
              }
            />
          </a>
        </div>
      ))}
    </div>
    <hr />
    {!moment().isSame(data.month, "month") && (
      <Alert bsStyle="success">
        五月挑战目前已经结束，看看五月志和琅琊榜吧。
      </Alert>
    )}
    {moment().isSame(data.month, "month") && (
      <div style={{ padding: 5, display: "flex", flexFlow: "row wrap" }}>
        {data.all_day_records.map(record => (
          <div
            key={record.id}
            style={{ width: 170, flex: "0 0 auto", margin: "20px auto" }}
          >
            <Team header={<User id={record.user.id} />} id={record.team.id}>
              <div style={{ padding: 10 }}>
                <Record showUser={false} id={record.id} />
              </div>
            </Team>
          </div>
        ))}
      </div>
    )}
  </>
));
