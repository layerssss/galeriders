import React from "react";
import PropTypes from "prop-types";
import { compose, setPropTypes } from "recompose";
import gql from "graphql-tag";
import _ from "lodash";

import withData from "../helpers/withData";

import User from "./User";
import Kilometers from "./Kilometers";

const RankItem = compose(
  setPropTypes({
    userId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired
  }),
  withData(
    gql`
      query($userId: ID!) {
        user(id: $userId) {
          id
          full_name
          team {
            id
            cover_url
          }
        }
      }
    `,
    ({ userId }) => ({ userId })
  )
)(({ data, index, score }) => (
  <a
    href={`/user/${data.user.id}`}
    style={{
      width: 200,
      flex: "1 1 auto",
      margin: 10,
      display: "flex",
      flexFlow: "row nowrap",
      justifyContent: "space-between",
      alignItems: "center",
      background: [
        `linear-gradient(to right, transparent, rgba(200, 200, 200, 0.7) 50%, #f9f9f9)`,
        !data.user.team
          ? "#ccc"
          : `left center / cover no-repeat url(${data.user.team.cover_url})`
      ].join(", "),
      color: "black",
      padding: "10px 2px"
    }}
  >
    <div
      style={{
        marginLeft: 10,
        width: 40,
        color: "white",
        fontWeight: "bold",
        textShadow: "0 0 5px black"
      }}
    >
      #
      <span
        style={{
          fontSize: "1.5em"
        }}
      >
        {index + 1}
      </span>
    </div>
    <User id={data.user.id} />
    <div style={{ lineHeight: 1, textAlign: "right", flex: "1 1 auto" }}>
      {data.user.full_name}
      <br />
      <Kilometers hundreds={score} />
    </div>
  </a>
));

const Rank = compose(
  setPropTypes({
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    ).isRequired
  })
)(({ users, rankBy }) => (
  <div
    style={{
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "center"
    }}
  >
    {_.orderBy(
      users
        .map(user => ({
          ...user,
          score: rankBy(user)
        }))
        .filter(user => user.score),
      u => u.score,
      "desc"
    ).map((user, userIndex) => (
      <RankItem
        key={user.id}
        userId={user.id}
        score={user.score}
        index={userIndex}
      />
    ))}
  </div>
));

export default Rank;
