import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Link from 'next/link';
import _ from 'lodash';
import {
  Button,
  Panel,
  Alert,
  Form,
  FormGroup,
  Image,
  Radio,
  Well,
  Tooltip,
  OverlayTrigger,
  ControlLabel,
  FormControl,
  Table,
} from 'react-bootstrap';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';

moment.locale('zh-cn');

const sum = arr => arr.reduce((a, b) => a + b, 0);

@data
@graphql(
  gql`
    query {
      allTeams {
        id
        name
        order
        users {
          id
          name
          picture
          records {
            id
            hundreds
            date
          }
        }
      }
      user {
        id
        team {
          id
          name
        }
        records {
          id
          hundreds
          date
        }
      }
    }
  `
)
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
@graphql(
  gql`
    mutation($date: DateTime!, $hundreds: Int!, $userId: ID!) {
      createRecord(date: $date, hundreds: $hundreds, userId: $userId) {
        id
        user {
          id
          records {
            id
            date
            hundreds
          }
        }
      }
    }
  `,
  { name: 'addRecord' }
)
class May extends React.PureComponent {
  static async getInitialProps() {
    return {};
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    joinTeam: PropTypes.func.isRequired,
    leaveTeam: PropTypes.func.isRequired,
    addRecord: PropTypes.func.isRequired,
  };

  static contextTypes = {
    useSpinner: PropTypes.func.isRequired,
  };

  state = {
    creatingRecord: false,
  };

  render() {
    const {
      data: { loading, allTeams, user: currentUser },
      joinTeam,
      leaveTeam,
      addRecord,
    } = this.props;
    const { useSpinner } = this.context;

    const myRecordsToday = !currentUser
      ? []
      : currentUser.records.filter(r =>
          moment(r.date).isSame(Date.now(), 'day')
        );

    return (
      <Layout title="五月挑战">
        {!currentUser ? (
          <Alert>
            <p>2018 五月挑战正在组队中哦， 请大家登录后选择自己的队伍</p>
          </Alert>
        ) : (
          <Panel>
            <Panel.Heading>
              <Panel.Title toggle>
                <span className="fa fa-user">我的记录</span>
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body collapsible>
              {!currentUser.team ? (
                <React.Fragment>
                  <Alert bsStyle="warning">
                    你还没有选择队伍，请选择队伍：
                  </Alert>
                  <Form
                    onSubmit={event =>
                      useSpinner(async () => {
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
                      })
                    }
                  >
                    <FormGroup>
                      {_.sortBy(allTeams, t => t.order).map(team => (
                        <React.Fragment key={team.id}>
                          <Radio name="team" value={team.id} inline>
                            {team.name}
                          </Radio>{' '}
                        </React.Fragment>
                      )) || <Alert>我今天还没跑呢</Alert>}
                    </FormGroup>
                    <FormGroup>
                      <Button type="submit">确认</Button>
                    </FormGroup>
                  </Form>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <p>我今天的记录：</p>
                  {!myRecordsToday.length ? (
                    <Alert bsStyle="warning">我今天还没跑步呢</Alert>
                  ) : (
                    <ul>
                      {myRecordsToday.map(record => (
                        <li key={record.id}>
                          {moment(record.date).format('LT')}:{' '}
                          {record.hundreds / 10} km
                        </li>
                      ))}
                    </ul>
                  )}
                  <hr />
                  {!this.state.creatingRecord ? (
                    <Button
                      onClick={() => this.setState({ creatingRecord: true })}
                    >
                      <span className="fa fa-plus" />添加记录
                    </Button>
                  ) : (
                    <Form
                      onSubmit={event =>
                        useSpinner(async () => {
                          event.preventDefault();
                          if (
                            // eslint-disable-next-line no-alert
                            !window.confirm(
                              '记录添加后无法更改或删除，请确认哈'
                            )
                          )
                            return;
                          const date = new Date();
                          const hundreds =
                            Number(
                              event.currentTarget.querySelector(
                                '[name="hundreds"]'
                              ).value
                            ) * 10;

                          if (Number.isNaN(hundreds)) return;

                          await addRecord({
                            variables: {
                              date,
                              hundreds,
                              userId: currentUser.id,
                            },
                          });

                          this.setState({ creatingRecord: false });
                        })
                      }
                    >
                      <FormGroup>
                        <ControlLabel>公里数：</ControlLabel>
                        <FormControl
                          name="hundreds"
                          type="number"
                          step="0.1"
                          defaultValue="1.0"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Button bsStyle="primary" type="submit">
                          <span className="fa fa-plus" />添加记录
                        </Button>{' '}
                        <Button
                          onClick={() =>
                            this.setState({ creatingRecord: false })
                          }
                        >
                          取消
                        </Button>
                      </FormGroup>
                    </Form>
                  )}
                  <hr />
                  <Button
                    bsStyle="danger"
                    onClick={() =>
                      useSpinner(async () => {
                        await leaveTeam({
                          variables: {
                            userId: currentUser.id,
                            teamId: currentUser.team.id,
                          },
                        });
                      })
                    }
                  >
                    重新选择队伍
                  </Button>
                </React.Fragment>
              )}
            </Panel.Body>
          </Panel>
        )}
        <Alert bsStyle="success">
          <p>
            五月挑战尚未开始，累积数据里暂时显示四月的里程，挑战开始时会从五月开始计算。
          </p>
        </Alert>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {!loading &&
            _.sortBy(allTeams, t => t.order)
              .map(team => ({
                ...team,
                records: [].concat(
                  ...team.users.map(u =>
                    u.records.map(r => ({ ...r, user: u }))
                  )
                ),
              }))
              .map(team => ({
                ...team,
                monthRecords: team.records.filter(r =>
                  moment(r.date).isSame('2018-04-01', 'month')
                ),
              }))
              .map(team => ({
                ...team,
                weekRecords: team.monthRecords.filter(r =>
                  moment(r.date).isSame(Date.now(), 'week')
                ),
              }))
              .map(team => (
                <Well
                  key={team.id}
                  style={{
                    margin: 10,
                    width: 460,
                  }}
                >
                  <p>{team.name}:</p>
                  <p>
                    四月累积里程:
                    {sum(team.monthRecords.map(r => r.hundreds)) / 10} 公里
                  </p>
                  <p>
                    本周累积里程:
                    {sum(team.weekRecords.map(r => r.hundreds)) / 10} 公里
                  </p>
                  <p>本周记录：</p>
                  <Table striped condensed hover>
                    <thead>
                      <tr>
                        <th />
                        <th>时间</th>
                        <th>里程</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        fontSize: '1.6em',
                      }}
                    >
                      {team.weekRecords.map(record => (
                        <tr key={record.id}>
                          <td>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id={`record-user-${record.id}`}>
                                  {record.user.name}
                                </Tooltip>
                              }
                            >
                              <Image
                                src={record.user.picture}
                                alt={record.user.name}
                                circle
                                style={{
                                  width: 40,
                                  height: 40,
                                  margin: 3,
                                }}
                              />
                            </OverlayTrigger>
                          </td>
                          <td>{moment(record.date).format('dddd LT')}</td>
                          <td>{record.hundreds / 10} 公里</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="clearfix">
                    {_.sortBy(team.users, u => u.name).map(user => (
                      <div
                        key={user.id}
                        style={{
                          float: 'left',
                          textAlign: 'center',
                          margin: 2,
                        }}
                      >
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id={`team-user-${user.id}`}>
                              {user.name}
                            </Tooltip>
                          }
                        >
                          <Image
                            src={user.picture}
                            alt={user.name}
                            circle
                            style={{
                              width: 30,
                              height: 30,
                            }}
                          />
                        </OverlayTrigger>
                      </div>
                    ))}
                  </div>
                </Well>
              ))}
        </div>
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
