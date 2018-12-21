import React from "react";
import { withProps, compose, fromRenderProps } from "recompose";
import { Button, Nav, NavItem } from "react-bootstrap";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import RoutingContext from "../helpers/RoutingContext";
import withData from "../helpers/withData";

import logo from "../images/logo.png";
import stravaLogo from "../images/icon_strava.jpg";

export default compose(
  withRouter,
  withData(gql`
    {
      current_user {
        id
        full_name
        picture_url
      }
      all_teams {
        id
        name
      }
      all_wiki_items {
        id
        title
      }
      all_users {
        id
        full_name
      }
    }
  `),
  withProps(({ data, location, history }) => {
    const featuredItems = ["Galeriders", "五月挑战"];

    const categories = [
      {
        title: "风车大百科",
        pages: [
          { title: "所有词条", pathname: "/" },
          ...data.all_wiki_items.map(item => ({
            title: `“${item.title}”`,
            hidden: !featuredItems.includes(item.title),
            pathname: `/wiki/${encodeURIComponent(item.id)}`
          }))
        ]
      },
      {
        title: "五月挑战",
        pages: [
          {
            title: "战况",
            pathname: "/may"
          },
          {
            title: "我的记录",
            pathname: "/myRecords"
          },
          {
            title: "五月志",
            pathname: "/timeline"
          },
          {
            title: "琅琊榜",
            pathname: "/leaderBoard"
          },
          ...data.all_teams.map(team => ({
            title: team.name,
            pathname: `/team/${team.id}`
          })),
          ...data.all_users.map(user => ({
            title: user.full_name,
            pathname: `/user/${user.id}`,
            hidden: true
          }))
        ]
      },
      {
        title: "大风车",
        hidden: true,
        pages: [
          {
            title: "登陆",
            pathname: "/auth"
          }
        ]
      }
    ];

    const currentCategory = categories.find(c =>
      c.pages.find(p => p.pathname === location.pathname)
    );
    if (!currentCategory)
      throw new Error(`page not found: ${location.pathname}`);

    const currentPage = currentCategory.pages.find(
      p => p.pathname === location.pathname
    );
    if (!currentPage) throw new Error(`page not found: ${location.pathname}`);

    return { currentPage, currentCategory, categories };
  }),
  fromRenderProps(RoutingContext.Consumer, ({ login, logout }) => ({
    login,
    logout
  }))
)(
  ({
    children,
    data,
    currentPage,
    currentCategory,
    categories,
    routerPush,
    login,
    logout
  }) => (
    <div
      style={{
        maxWidth: 1024,
        margin: "0 auto",
        position: "relative"
      }}
    >
      <Helmet>
        <title>
          {currentPage.title} - {currentCategory.title}
        </title>
      </Helmet>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: 10,
          right: 10,
          fontSize: 32,
          lineHeight: 1
        }}
      >
        <a href="https://www.facebook.com/galeriders/">
          <span
            className="fa fa-fw fa-facebook-official"
            style={{ color: "#4267b2" }}
          >
            <span className="sr-only">Facebook</span>
          </span>
        </a>
        <a href="https://www.facebook.com/galeriders/">
          <span className="fa fa-fw fa-weixin" style={{ color: "#44b549" }}>
            <span className="sr-only">微信</span>
          </span>
        </a>
        <a href="https://www.strava.com/clubs/galeriders">
          <img
            style={{ width: ".9em", position: "relative", top: "-.1em" }}
            src={stravaLogo}
            alt="Strava"
          />
        </a>
        <a href="https://github.com/layerssss/galeriders">
          <span className="fa fa-github" style={{ color: "#444" }}>
            <span className="sr-only">GitHub</span>
          </span>
        </a>
        <span
          style={{
            fontSize: 18,
            textAlign: "right",
            margin: "0 10px"
          }}
        >
          {!data.current_user ? (
            <Button onClick={() => login()}>
              <span className="fa fa-user" />
              登录
            </Button>
          ) : (
            <>
              <Button onClick={() => logout()} active>
                <img
                  style={{
                    height: "2em",
                    width: "2em"
                  }}
                  src={data.current_user.picture_url}
                  alt={`${data.current_user.name}的照片`}
                />
                {data.current_user.name}
              </Button>
            </>
          )}
        </span>
      </div>
      <div
        style={{
          padding: 10,
          display: "flex",
          flexFlow: "row wrap",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <a
          href="/"
          style={{
            width: 80,
            maxWidth: "10vw",
            marginRight: 20
          }}
        >
          <img
            style={{
              width: "100%"
            }}
            src={logo}
            alt="大风车"
          />
        </a>
        <div>
          <h2 style={{ fontSize: "2em", margin: "5px 0" }}>
            {currentCategory.title}
          </h2>
          <h1 style={{ fontSize: "1em", color: "#888", margin: 0 }}>
            {currentPage.title}
          </h1>
        </div>
      </div>
      <div style={{ padding: 10 }}>
        <Nav bsStyle="tabs">
          {categories
            .filter(c => !c.hidden)
            .map(category => (
              <NavItem
                active={currentCategory === category}
                key={category.title}
                title={category.title}
                href={category.pages.filter(p => !p.hidden)[0].pathname}
              >
                {category.title}
              </NavItem>
            ))}
        </Nav>
      </div>
      <div
        style={{
          padding: 10
        }}
      >
        <Nav bsStyle="pills">
          {currentCategory.pages
            .filter(p => !p.hidden)
            .map(page => (
              <NavItem
                active={page === currentPage}
                key={page.title}
                title={page.title}
                href={page.pathname}
              >
                {page.title}
              </NavItem>
            ))}
        </Nav>
      </div>
      <div
        style={{
          padding: 10
        }}
      >
        {children}
      </div>
    </div>
  )
);
