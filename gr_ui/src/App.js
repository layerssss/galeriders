import React from "react";
import gql from "graphql-tag";
import NProgress from "nprogress";
import {
  compose,
  lifecycle,
  withProps,
  withState,
  withHandlers
} from "recompose";
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  withRouter
} from "react-router-dom";
import EventListener from "react-event-listener";
import { ApolloProvider } from "react-apollo";
import jQuery from "jquery";

import IndexPage from "./pages/IndexPage";
import AuthPage from "./pages/AuthPage";
import LeaderBoardPage from "./pages/LeaderBoardPage";
import MayPage from "./pages/MayPage";
import MyRecordsPage from "./pages/MyRecordsPage";
import TeamPage from "./pages/TeamPage";
import TimelinePage from "./pages/TimelinePage";
import UserPage from "./pages/UserPage";
import WikiPage from "./pages/WikiPage";

import Layout from "./components/Layout";

import withWrapper from "./helpers/withWrapper";
import RoutingContext from "./helpers/RoutingContext";
import apolloClient from "./helpers/apolloClient";

const SpinnerEventListner = compose(
  withState("spinners", "setSpinners", []),
  withHandlers({
    checkSpinners: ({ spinners }) => () => {
      if (spinners.length) NProgress.inc();
      else NProgress.done();
    }
  })
)(({ setSpinners, checkSpinners, spinners }) => (
  <>
    <EventListener
      target={window}
      onSpinnerStart={event => {
        const id = event.detail.id;
        setSpinners(spinners => [...spinners, id], checkSpinners);
      }}
      onSpinnerStop={event => {
        const id = event.detail.id;
        setSpinners(spinners => spinners.filter(s => s !== id), checkSpinners);
      }}
    />

    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1,
        transition: "opacity ease .3s",
        ...(!spinners.length
          ? {
              pointerEvents: "none",
              opacity: 0
            }
          : {
              opacity: 0.2
            })
      }}
    />
  </>
));

const RouteEventListener = compose(
  withRouter,
  lifecycle({
    componentDidMount: function() {
      const { history } = this.props;

      jQuery(document).on("click.link", "a[href]", event => {
        if (event.isDefaultPrevented()) return;
        const href = event.currentTarget.getAttribute("href");
        if (!href.startsWith("/")) return;
        event.preventDefault();
        history.push(href);
      });
    },

    componentWillUnmount: () => {
      jQuery(document).off("click.link");
    }
  })
)(() => null);

export default compose(
  withWrapper(BrowserRouter),
  withWrapper(ApolloProvider, { client: apolloClient }),
  withRouter,
  withProps(({ history, location }) => ({
    login: () => {
      localStorage.setItem("redirectPath", location.pathname);
      history.push("/auth");
    },
    logout: async () => {
      localStorage.removeItem("token");

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
    }
  })),
  withWrapper(RoutingContext.Provider, ({ login, logout }) => ({
    value: { login, logout }
  })),
  withWrapper(Layout)
)(() => (
  <>
    <RouteEventListener />
    <SpinnerEventListner />
    <Switch>
      <Route path="/" exact component={IndexPage} />
      <Route path="/auth" exact component={AuthPage} />
      <Route path="/leaderBoard" exact component={LeaderBoardPage} />
      <Route path="/may" exact component={MayPage} />
      <Route path="/myRecords" exact component={MyRecordsPage} />
      <Route path="/team/:teamId" exact component={TeamPage} />
      <Route path="/timeline" exact component={TimelinePage} />
      <Route path="/user/:userId" exact component={UserPage} />
      <Route path="/wiki/:wikiItemId" exact component={WikiPage} />
      <Redirect to="/" />
    </Switch>
  </>
));
