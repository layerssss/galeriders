import React from "react";
import { compose } from "recompose";
import gql from "graphql-tag";
import { Label } from "react-bootstrap";

import Time from "../components/Time.js";
import withData from "../helpers/withData";

export default compose(
  withData(gql`
    query {
      all_wiki_items {
        id
        title
        aliases
        updated_at
        updated_by_user {
          id
          full_name
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
        justifyContent: "stretch"
      }}
    >
      {data.all_wiki_items.map(item => (
        <a
          key={item.id}
          href={`/wiki/${item.id}`}
          style={{
            display: "block",
            width: 250,
            margin: 10,
            flex: "1 0 auto",

            boxShadow: "0 1px 5px #aaa",
            textDecoration: "none",
            borderRadius: 5,
            padding: 10
          }}
        >
          <Label className="pull-right">
            <Time time={item.updated_at} />{" "}
            {item.updated_by_user && <>由 {item.updated_by_user.full_name}</>}
          </Label>
          <h2
            style={{
              fontSize: "1.5em",
              margin: 0
            }}
          >
            {item.title}
          </h2>
          <div style={{ margin: "5px 0" }}>
            {item.aliases &&
              item.aliases.map(alias => (
                <Label bsStyle="info" style={{ margin: 5 }} key={alias}>
                  {alias}
                </Label>
              ))}
          </div>
        </a>
      ))}
    </div>
  </>
));
