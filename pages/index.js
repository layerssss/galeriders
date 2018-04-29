import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Link from 'next/link';
import {
  Button,
  Panel,
  Alert,
  Form,
  FormGroup,
  Image,
  Radio,
} from 'react-bootstrap';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';

@data
@graphql(gql`
  query {
    allTeams {
      id
      name
      users {
        id
        name
        picture
      }
    }
    currentUser: user {
      id
      team {
        id
        name
      }
    }
  }
`)
@graphql(
  gql`
    mutation($userId: ID!, $teamId: ID!) {
      addToTeamOnUser(usersUserId: $userId, teamTeamId: $teamId) {
        usersUser {
          id
          team {
            id
          }
        }
        teamTeam {
          id
          users {
            id
          }
        }
      }
    }
  `,
  { name: 'joinTeam' }
)
@graphql(
  gql`
    mutation($userId: ID!, $teamId: ID!) {
      removeFromTeamOnUser(usersUserId: $userId, teamTeamId: $teamId) {
        teamTeam {
          id
          users {
            id
          }
        }
        usersUser {
          id
          team {
            id
          }
        }
      }
    }
  `,
  { name: 'leaveTeam' }
)
class May extends React.PureComponent {
  static async getInitialProps() {
    return {};
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    joinTeam: PropTypes.func.isRequired,
    leaveTeam: PropTypes.func.isRequired,
  };

  render() {
    const {
      data: { loading, allTeams, currentUser },
      joinTeam,
      leaveTeam,
    } = this.props;

    return (
      <Layout title="五月挑战">
        <p>五月挑战正在组队中哦，请大家选择自己所在队伍：</p>
        {!loading &&
          allTeams.map(team => (
            <div className="clearfix" key={team.id}>
              <p>{team.name}:</p>
              {team.users.map(user => (
                <div
                  key={user.id}
                  style={{
                    float: 'left',
                    textAlign: 'center',
                  }}
                >
                  <Image src={user.picture} alt={user.name} circle />
                  <p>{user.name}</p>
                </div>
              ))}
            </div>
          ))}
        {currentUser && (
          <Panel>
            <Panel.Heading>我的状态</Panel.Heading>
            <Panel.Body>
              {!currentUser.team ? (
                <React.Fragment>
                  <Alert>你还没有选择队伍，请选择队伍：</Alert>
                  <Form
                    onSubmit={async event => {
                      event.preventDefault();
                      const formElement = event.currentTarget;
                      const selectedElement = formElement.querySelector(
                        'input[name="team"]:checked'
                      );
                      if (!selectedElement) return;

                      await joinTeam({
                        variables: {
                          teamId: selectedElement.value,
                          userId: currentUser.id,
                        },
                      });
                    }}
                  >
                    <FormGroup>
                      {allTeams.map(team => (
                        <React.Fragment key={team.id}>
                          <Radio name="team" value={team.id} inline>
                            {team.name}
                          </Radio>{' '}
                        </React.Fragment>
                      ))}
                    </FormGroup>
                    <FormGroup>
                      <Button type="submit">确认</Button>
                    </FormGroup>
                  </Form>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Alert>
                    <p>好了，暂时就这么多了 ，耐心地等待吧</p>
                  </Alert>
                  <hr />
                  <Button
                    bsStyle="danger"
                    onClick={async () => {
                      await leaveTeam({
                        variables: {
                          userId: currentUser.id,
                          teamId: currentUser.team.id,
                        },
                      });
                    }}
                  >
                    重新选择队伍
                  </Button>
                </React.Fragment>
              )}
            </Panel.Body>
          </Panel>
        )}
        <p>其它</p>
        <hr />
        <ul>
          <li>
            <Link href="/wiki?name=%E4%BA%94%E6%9C%88%E6%8C%91%E6%88%98">
              <a>关于“五月挑战”</a>
            </Link>
          </li>
          <li>
            <Link href="/wikiIndex">
              <a>风车大百科</a>
            </Link>
          </li>
        </ul>
      </Layout>
    );
  }
}

export default May;
