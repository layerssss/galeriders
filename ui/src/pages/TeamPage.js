import React from "react";
import { compose } from "recompose";
import _ from "lodash";
import { Panel } from "react-bootstrap";
import gql from "graphql-tag";

import moment from "../helpers/moment";
import withData from "../helpers/withData";

import Record from "../components/Record";
import Team from "../components/Team";
import Kilometers from "../components/Kilometers";
import Rank from "../components/Rank";

export default compose(
  withData(
    gql`
      query($teamId: ID!) {
        team(id: $teamId) {
          id
          name
          month_total_hundreds
          users {
            id
            month_total_hundreds
          }
          month_records {
            id
            time
          }
        }
      }
    `,
    ({ match }) => ({
      teamId: match.params.teamId
    })
  )
)(({ data, week }) => (
  <>
    <Team
      id={data.team.id}
      header={
        <div style={{ textAlign: "center" }}>
          {data.team.name}
          <br />
          <Kilometers hundreds={data.team.month_total_hundreds} />
        </div>
      }
    >
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          margin: "0 -5px"
        }}
      >
        <div
          style={{
            // wrap it
            flex: "1 0 auto",
            width: 250,
            margin: 5
          }}
        >
          <Panel>
            <Panel.Heading>
              <Panel.Title>{data.team.name}</Panel.Title>
            </Panel.Heading>
            <Rank
              users={data.team.users}
              rankBy={user => user.month_total_hundreds}
            />
          </Panel>
        </div>
        <div
          style={{
            flex: "100 0 auto",
            width: 250,
            margin: 5
          }}
        >
          {Object.entries(
            _.groupBy(data.team.month_records, r =>
              moment(r.time).format("dddd Do")
            )
          ).map(([day, records]) => (
            <Panel key={day}>
              <Panel.Heading>
                <Panel.Title>{day}</Panel.Title>
              </Panel.Heading>
              <div
                style={{
                  display: "flex",
                  flexFlow: "row wrap"
                }}
              >
                {records.map(record => (
                  <div key={record.id} style={{ width: 200, flex: "0 0 auto" }}>
                    <Record id={record.id} />
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </Team>
  </>
));
