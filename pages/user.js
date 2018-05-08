import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import { Button, Panel, Form, FormGroup, FormControl } from 'react-bootstrap';

import data from '../lib/data.js';
import Markdown from '../components/Markdown';
import Layout from '../components/Layout.js';
import Team from '../components/Team.js';
import Record from '../components/Record';
import User from '../components/User';
import moment from '../lib/moment.js';
import getMonthRecords from '../lib/getMonthRecords.js';

@data
@graphql(
  gql`
    query($userId: ID!) {
      user: User(id: $userId) {
        id
        name
        description
        auth0UserId
        team {
          id
          name
          cover {
            id
            url
          }
        }
        records {
          id
          hundreds
          date
          file {
            id
            url
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
      updateUser(id: $userId, description: $description) {
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
      data: { user },
      updateUserDescription,
    } = this.props;

    const { useSpinner } = this.context;

    const sortRecords = records =>
      _.orderBy(records, [r => moment(r.date).valueOf()], ['desc']);

    return (
      <Layout pageTitle={user && user.name} categoryTitle="五月挑战">
        {user && (
          <Team
            team={user.team}
            header={
              <>
                <User user={user} />
                {user.name}
              </>
            }
          >
            <Panel>
              <Panel.Body>
                {!this.state.editing && <Markdown source={user.description} />}
                {!this.state.editing && (
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
              {sortRecords(getMonthRecords(user.records)).map(record => (
                <div key={record.id} style={{ width: 200, flex: '0 0 auto' }}>
                  <Record record={{ ...record, user }} />
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
