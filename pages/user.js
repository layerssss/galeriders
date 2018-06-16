import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Button, Panel, Form, FormGroup, FormControl } from 'react-bootstrap';

import data from '../lib/data.js';
import Markdown from '../components/Markdown';
import Layout from '../components/Layout.js';
import Team from '../components/Team.js';
import Record from '../components/Record';
import Kilometers from '../components/Kilometers';
import User from '../components/User';

@data
@graphql(
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
        picture_url
        month_total_hundreds
        team {
          id
          name
          cover_url
          color
        }
        month_records {
          id
          hundreds
          time
          picture_url
          user {
            id
            picture_url
            full_name
          }
        }
      }
    }
  `,
  {
    options: ({ userId }) => ({
      variables: {
        userId,
      },
    }),
  }
)
@graphql(
  gql`
    mutation($userId: ID!, $description: String!) {
      update_user_description(id: $userId, description: $description) {
        id
        description
      }
    }
  `,
  { name: 'updateUserDescription' }
)
class UserPage extends React.PureComponent {
  static async getInitialProps({ query }) {
    const userId = query.id;
    return { userId };
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    updateUserDescription: PropTypes.func.isRequired,
  };

  static contextTypes = {
    useSpinner: PropTypes.func.isRequired,
  };

  state = {
    editing: false,
  };

  render() {
    const {
      data: { user, current_user },
      updateUserDescription,
    } = this.props;

    const { useSpinner } = this.context;

    return (
      <Layout pageTitle={user && user.full_name} categoryTitle="五月挑战">
        {user && (
          <Team
            team={user.team}
            header={
              <>
                <p>
                  <User user={user} />
                  {user.full_name}
                </p>
              </>
            }
          >
            <Panel>
              <Panel.Body>
                <p>
                  五月累积里程：<Kilometers
                    hundreds={user.month_total_hundreds}
                  />
                </p>
                {!this.state.editing && <Markdown source={user.description} />}
                {!this.state.editing &&
                  current_user &&
                  (current_user.is_admin || current_user.id === user.id) && (
                    <Button
                      bsStyle="info"
                      onClick={() => this.setState({ editing: true })}
                    >
                      修改简介
                    </Button>
                  )}
                {this.state.editing && (
                  <Form
                    onSubmit={event =>
                      useSpinner(async () => {
                        event.preventDefault();
                        const form = event.currentTarget;
                        const descriptionInput = form.querySelector(
                          '[name="description"]'
                        );
                        const description = descriptionInput.value;
                        await updateUserDescription({
                          variables: {
                            userId: user.id,
                            description,
                          },
                        });

                        this.setState({ editing: false });
                      })
                    }
                  >
                    <FormGroup>
                      <FormControl
                        componentClass="textarea"
                        name="description"
                        defaultValue={user.description}
                        rows={5}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Button bsStyle="primary" type="submit">
                        确定
                      </Button>{' '}
                      <Button onClick={() => this.setState({ editing: false })}>
                        取消
                      </Button>
                    </FormGroup>
                  </Form>
                )}
              </Panel.Body>
            </Panel>
            <div
              style={{
                display: 'flex',
                flexFlow: 'row wrap',
              }}
            >
              {user.month_records.map(record => (
                <div key={record.id} style={{ width: 200, flex: '0 0 auto' }}>
                  <Record record={record} />
                </div>
              ))}
            </div>
          </Team>
        )}
      </Layout>
    );
  }
}

export default UserPage;
