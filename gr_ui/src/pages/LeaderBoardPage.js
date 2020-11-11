import React from "react";
import { compose } from "recompose";
import gql from "graphql-tag";

import withData from "../helpers/withData";

import Rank from "../components/Rank";

export default compose(
  withData(gql`
    query {
      all_users {
        id
        month_total_hundreds
      }
    }
  `)
)(({ data }) => (
  <>
    <Rank users={data.all_users} rankBy={user => user.month_total_hundreds} />
  </>
));
