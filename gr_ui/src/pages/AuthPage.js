import React from "react";
import gql from "graphql-tag";
import { compose, withProps } from "recompose";
import { withRouter } from "react-router-dom";

import Lock0 from "../components/Lock0";
import apolloClient from "../helpers/apolloClient";

export default compose(
  withRouter,
  withProps(({ history }) => ({
    redirect: () => {
      const redirectPath = localStorage.getItem("redirectPath") || "/";
      localStorage.removeItem("redirectPath");
      history.push(redirectPath !== "/auth" ? redirectPath : "/");
    }
  }))
)(({ login, redirect }) => (
  <>
    <Lock0
      onCancel={() => {
        redirect();
      }}
      onLogin={async ({ token }) => {
        localStorage.setItem("token", token);

        await apolloClient.query({
          fetchPolicy: "network-only",
          query: gql`
            {
              current_user {
                id
              }
            }
          `
        });

        redirect();
      }}
    />
  </>
));
