import React from "react";
import PropTypes from "prop-types";
import { compose, setPropTypes } from "recompose";
import gql from "graphql-tag";
import { Image } from "react-bootstrap";

import withData from "../helpers/withData";

export default compose(
  setPropTypes({
    id: PropTypes.string.isRequired
  }),
  withData(
    gql`
      query($id: ID!) {
        user(id: $id) {
          id
          full_name
          picture_url
        }
      }
    `,
    ({ id }) => ({ id })
  )
)(({ data }) => (
  <Image
    src={data.user.picture_url}
    alt={data.user.full_name}
    circle
    style={{
      width: 40,
      height: 40,
      marginRight: 10,
      border: "solid 1px #666",
      boxShadow: "0 0 10px white"
    }}
  />
));
