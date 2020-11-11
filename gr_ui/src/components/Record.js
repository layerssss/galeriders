import React from "react";
import PropTypes from "prop-types";
import { compose, setPropTypes, withProps } from "recompose";
import { Image } from "react-bootstrap";
import gql from "graphql-tag";

import moment from "../helpers/moment";
import withData from "../helpers/withData";

import User from "./User";
import Kilometers from "./Kilometers";

export default compose(
  setPropTypes({
    id: PropTypes.string.isRequired,
    showUser: PropTypes.bool
  }),
  withProps({
    today: moment()
  }),
  withData(
    gql`
      query($id: ID!) {
        record(id: $id) {
          id
          hundreds
          time
          picture_url
          user {
            id
            full_name
          }
        }
      }
    `,
    ({ id }) => ({ id })
  )
)(({ data, showUser, today }) => (
  <div
    style={{
      padding: "10px 0",
      display: "flex"
    }}
  >
    <div
      style={{
        flex: "1 0 auto",
        textAlign: "center"
      }}
    >
      {showUser && (
        <>
          <User id={data.record.user.id} />
          <br />
        </>
      )}
      <Kilometers hundreds={data.record.hundreds} />
      <br />
      {data.record.user.full_name}
      <br />
      {moment(data.record.time).isSame(today, "week")
        ? moment(data.record.time).calendar()
        : moment(data.record.time).format("Do dddd LT")}
    </div>
    <div style={{ width: "40%" }}>
      <a href={data.record.picture_url}>
        <Image src={data.record.picture_url} style={{ width: "100%" }} />
      </a>
    </div>
  </div>
));
