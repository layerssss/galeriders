import React from "react";
import gql from "graphql-tag";
import { compose, withState } from "recompose";
import {
  Label,
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap";

import Markdown from "../components/Markdown";
import Time from "../components/Time";
import withData from "../helpers/withData";
import withMutation from "../helpers/withMutation";

export default compose(
  withData(
    gql`
      query($id: ID!) {
        wiki_item(id: $id) {
          id
          title
          content
          aliases
          updated_at
          updated_by_user {
            id
            full_name
          }
          revisions {
            id
            created_at
            updated_by_user {
              id
              full_name
            }
          }
        }
        current_user {
          id
        }
      }
    `,
    ({ match }) => ({
      id: match.params.wikiItemId
    })
  ),
  withMutation(
    gql`
      mutation($title: String!, $aliases: [String!]!, $content: String!) {
        update_wiki_item(title: $title, aliases: $aliases, content: $content) {
          id
          aliases
          content
          updated_at
          updated_by_user {
            id
            full_name
          }
          revisions {
            id
            content
            created_at
            updated_by_user {
              id
            }
          }
        }
      }
    `,
    "update_wiki_item"
  ),
  withState("editing", "setEditing", false)
)(({ data, editing, setEditing, update_wiki_item }) => (
  <>
    <>
      {!editing && (
        <>
          <p>
            别名：
            {data.wiki_item.aliases.map(alias => (
              <Label bsStyle="info" style={{ margin: 5 }} key={alias}>
                {alias}
              </Label>
            ))}
          </p>
          <div
            style={{
              display: "flex",
              flexFlow: "row nowrap"
            }}
          >
            <span
              style={{
                fontSize: "5em",
                color: "#ccc",
                alignSelf: "flex-start"
              }}
            >
              “
            </span>
            <Markdown
              style={{
                fontSize: "1.3em",
                maxWidth: 600,
                margin: 20
              }}
              source={data.wiki_item.content}
            />
            <span
              style={{
                fontSize: "5em",
                color: "#ccc",
                alignSelf: "flex-end"
              }}
            >
              ”
            </span>
          </div>
          <p>
            <Time time={data.wiki_item.updated_at} />
            {data.wiki_item.updated_by_user && (
              <>由{data.wiki_item.updated_by_user.full_name}</>
            )}
            编辑{" "}
            {data.current_user && (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                href="#"
                onClick={event => {
                  event.preventDefault();
                  setEditing(true);
                }}
              >
                修改
              </a>
            )}
          </p>
        </>
      )}
      {editing && (
        <form
          onSubmit={async event => {
            event.preventDefault();
            const formElement = event.currentTarget;

            const aliases = formElement
              .querySelector('[name="aliases"]')
              .value.split(",")
              .map(a => a.trim())
              .filter(a => a);
            const content = formElement.querySelector('[name="content"]').value;

            await update_wiki_item({
              title: data.wiki_item.title,
              aliases,
              content
            });

            setEditing(false);
          }}
        >
          <FormGroup controlId="aliases">
            <ControlLabel>别名:</ControlLabel>
            <FormControl
              type="text"
              name="aliases"
              defaultValue={data.wiki_item.aliases.join(", ")}
            />
            <HelpBlock>用半角逗号(,)分隔</HelpBlock>
          </FormGroup>
          <FormGroup controlId="content">
            <ControlLabel>内容:</ControlLabel>
            <FormControl
              componentClass="textarea"
              name="content"
              defaultValue={data.wiki_item.content}
              rows={10}
            />
            <HelpBlock>
              支持{" "}
              <a href="https://zh.wikipedia.org/zh-hans/Markdown">
                Markdown 格式
              </a>
            </HelpBlock>
          </FormGroup>
          <FormGroup>
            <Button type="submit" bsStyle="primary">
              保存
            </Button>{" "}
            <Button onClick={() => setEditing(false)}>取消</Button>
          </FormGroup>
          <FormGroup>
            <ControlLabel>修改记录：</ControlLabel>
            {data.wiki_item.revisions.map(revision => (
              <p key={revision.id}>
                <Time time={revision.created_at} />
                {revision.updated_by_user && (
                  <>由 {revision.updated_by_user.full_name}</>
                )}{" "}
                编辑
              </p>
            ))}
          </FormGroup>
        </form>
      )}
    </>
  </>
));
