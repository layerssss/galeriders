import React from "react";
import gql from "graphql-tag";
import { compose, withState } from "recompose";
import { Form, FormGroup, FormControl, Panel, Button } from "react-bootstrap";

import Team from "../components/Team";
import User from "../components/User";
import Kilometers from "../components/Kilometers";
import Record from "../components/Record";
import Markdown from "../components/Markdown";

import withData from "../helpers/withData";
import withMutation from "../helpers/withMutation";

export default compose(
  withState("editing", "setEditing", false),
  withData(
    gql`
      query($userId: ID!) {
        current_user {
          id
          is_admin
        }
        user(id: $userId) {
          id
          full_name
          description
          month_total_hundreds
          team {
            id
          }
          month_records {
            id
          }
        }
      }
    `,
    ({ match }) => ({ userId: match.params.userId })
  ),
  withMutation(
    gql`
      mutation($userId: ID!, $description: String!) {
        update_user_description(id: $userId, description: $description) {
          id
          description
        }
      }
    `,
    "updateUserDescription"
  )
)(({ editing, setEditing, data, updateUserDescription }) => (
  <>
    <Team
      id={data.user.team.id}
      header={
        <>
          <p>
            <User id={data.user.id} />
            {data.user.full_name}
          </p>
        </>
      }
    >
      <Panel>
        <Panel.Body>
          <p>
            五月累积里程：
            <Kilometers hundreds={data.user.month_total_hundreds} />
          </p>
          {!editing && <Markdown source={data.user.description} />}
          {!editing &&
            data.current_user &&
            (data.current_user.is_admin ||
              data.current_user.id === data.user.id) && (
              <Button bsStyle="info" onClick={() => setEditing(true)}>
                修改简介
              </Button>
            )}
          {editing && (
            <Form
              onSubmit={async event => {
                event.preventDefault();
                const form = event.currentTarget;
                const descriptionInput = form.querySelector(
                  '[name="description"]'
                );
                const description = descriptionInput.value;
                await updateUserDescription({
                  userId: data.user.id,
                  description
                });

                setEditing(false);
              }}
            >
              <FormGroup>
                <FormControl
                  componentClass="textarea"
                  name="description"
                  defaultValue={data.user.description}
                  rows={5}
                />
              </FormGroup>
              <FormGroup>
                <Button bsStyle="primary" type="submit">
                  确定
                </Button>{" "}
                <Button onClick={() => setEditing(false)}>取消</Button>
              </FormGroup>
            </Form>
          )}
        </Panel.Body>
      </Panel>
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap"
        }}
      >
        {data.user.month_records.map(record => (
          <div key={record.id} style={{ width: 200, flex: "0 0 auto" }}>
            <Record id={record.id} />
          </div>
        ))}
      </div>
    </Team>
  </>
));
