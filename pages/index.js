import React from 'react';
import moment from 'moment-timezone';
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
  ControlLabel,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import User from '../components/User.js';
import uploadFile from '../lib/uploadFile.js';
import Record from '../components/Record';
import getDayRecords from '../lib/getDayRecords.js';
import getMonthRecords from '../lib/getMonthRecords.js';
import getWeekRecords from '../lib/getWeekRecords.js';
import timezone from '../lib/timezone.js';
import sum from '../lib/sum.js';

moment.tz.setDefault(timezone);
moment.locale('zh-cn');

@data
@graphql(
  gql`
    query {
      allTeams {
        id
        name
        published
        order
        cover {
          id
          url
        }
        users {
          id
          name
          auth0UserId
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
      user {
        id
        name
        auth0UserId
        team {
          id
          name
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
    mutation($date: DateTime!, $hundreds: Int!, $userId: ID!, $fileId: ID!) {
      createRecord(
        date: $date
        hundreds: $hundreds
        userId: $userId
        fileId: $fileId
      ) {
        id
        user {
          id
          records {
            id
            date
            hundreds
            file {
              id
              url
            }
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
    addRecord: PropTypes.func.isRequired,
  };

  static contextTypes = {
    useSpinner: PropTypes.func.isRequired,
  };

  state = {
    showingRecordsOf: 'DAY',
    creatingRecord: false,
  };

  render() {
    const {
      data: { loading, allTeams, user: currentUser },
      joinTeam,
      addRecord,
    } = this.props;
    const { useSpinner } = this.context;

    const myRecordsToday = !currentUser
      ? []
      : getDayRecords(currentUser.records);

    const sortTeams = teams => _.sortBy(teams, t => t.order);
    const sortRecords = records =>
      _.orderBy(records, [r => moment(r.date).valueOf()], ['desc']);

    return (
      <Layout title="五月挑战">
        {!currentUser && (
          <Alert>
            <p>你还没登录呢，登录后查看更多信息。</p>
          </Alert>
        )}
        {currentUser && (
          <>
            {!currentUser.team && (
              <Panel>
                <Panel.Body>
                  <Alert bsStyle="warning">
                    你还没有选择队伍，请选择队伍，选择后不能换哈：
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
                        if (!window.confirm('选择队伍后无法更换，确定哈？'))
                          return;

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
                      {sortTeams(allTeams.filter(t => t.published)).map(
                        team => (
                          <React.Fragment key={team.id}>
                            <Radio name="team" value={team.id} inline>
                              {team.name}
                            </Radio>{' '}
                          </React.Fragment>
                        )
                      ) || <Alert>我今天还没跑呢</Alert>}
                    </FormGroup>
                    <FormGroup>
                      <Button type="submit">确认</Button>
                    </FormGroup>
                  </Form>
                </Panel.Body>
              </Panel>
            )}
            {currentUser.team && (
              <Panel>
                <Panel.Heading>
                  <Panel.Title>
                    <span className="fa fa-user">我的记录/添加记录</span>
                  </Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  <p>我今天的记录：</p>
                  {!myRecordsToday.length ? (
                    <Alert bsStyle="warning">我今天还没跑步呢</Alert>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexFlow: 'row wrap',
                      }}
                    >
                      {sortRecords([...myRecordsToday]).map(record => (
                        <div
                          key={record.id}
                          style={{
                            width: 240,
                            margin: 5,
                          }}
                        >
                          <Record record={{ ...record, user: currentUser }} />
                        </div>
                      ))}
                    </div>
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
                          const form = event.currentTarget;
                          const date = new Date();
                          const hundreds =
                            Number(
                              form.querySelector('[name="hundreds"]').value
                            ) * 10;

                          if (
                            hundreds <= 0 ||
                            Number.isNaN(hundreds) ||
                            hundreds > 2000
                          )
                            return alert('公里数无效哈');

                          const { file } = this.state;
                          if (!file) return alert('请上传个屏幕截图或者照片哈');

                          if (
                            !window.confirm(
                              '记录添加后无法更改或删除，请确认哈'
                            )
                          )
                            return;

                          const { id: fileId } = await uploadFile(file);

                          await addRecord({
                            variables: {
                              date,
                              hundreds,
                              fileId,
                              userId: currentUser.id,
                            },
                          });

                          this.setState({
                            creatingRecord: false,
                            file: null,
                            fileURI: null,
                          });
                          form.reset();
                        })
                      }
                    >
                      <FormGroup>
                        <ControlLabel>公里数：</ControlLabel>
                        <FormControl
                          name="hundreds"
                          type="number"
                          step="0.1"
                          defaultValue="0.0"
                        />
                      </FormGroup>

                      <FormGroup>
                        <ControlLabel>屏幕截图/照片：</ControlLabel>
                        <FormControl
                          name="file"
                          type="file"
                          accept="image/*"
                          onChange={event => {
                            const [file] = event.target.files;
                            const fileURI = !file
                              ? null
                              : URL.createObjectURL(file);
                            this.setState({ file, fileURI });
                          }}
                        />
                        {this.state.fileURI && (
                          <Image
                            src={this.state.fileURI}
                            alt="选择的图片"
                            style={{ width: 230 }}
                          />
                        )}
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
                </Panel.Body>
              </Panel>
            )}
          </>
        )}
        <div style={{ textAlign: 'right' }}>
          <FormGroup>
            <ToggleButtonGroup
              type="radio"
              name="showingRecordsOf"
              value={this.state.showingRecordsOf}
              onChange={value => this.setState({ showingRecordsOf: value })}
            >
              <ToggleButton value="DAY">今天记录</ToggleButton>
              <ToggleButton value="WEEK">本周排行</ToggleButton>
              <ToggleButton value="MONTH">五月排行</ToggleButton>
            </ToggleButtonGroup>
          </FormGroup>
        </div>

        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {!loading &&
            sortTeams(allTeams.filter(t => t.published))
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
                dayRecords: getDayRecords(team.records),
              }))
              .map(team => ({
                ...team,
                monthRecords: getMonthRecords(team.records),
              }))
              .map(team => ({
                ...team,
                weekRecords: getWeekRecords(team.monthRecords),
              }))
              .map(team => ({
                ...team,
                showingRecords: {
                  DAY: team.dayRecords,
                  WEEK: team.weekRecords,
                  MONTH: team.monthRecords,
                }[this.state.showingRecordsOf],
              }))
              .map(team => (
                <div
                  key={team.id}
                  style={{
                    width: 250,
                    flex: '1 0 auto',
                  }}
                >
                  <Well
                    style={{
                      margin: 10,
                      position: 'relative',
                      padding: 5,
                      paddingTop: '80%',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        paddingTop: '80%',
                        ...(team.cover && {
                          backgroundImage: `url(${team.cover.url})`,
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                        }),
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(transparent, #f9f9f9)`,
                          textIndent: -9999,
                        }}
                      >
                        {team.name}:
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: 24,
                          color: 'white',
                          textShadow: '0 0 20px black',
                        }}
                      >
                        <span style={{ fontSize: '2em' }}>
                          {sum(team.monthRecords.map(r => r.hundreds)) / 10}
                        </span>km
                      </div>
                    </div>
                    <p style={{ textAlign: 'center' }}>
                      {
                        {
                          DAY: '今天',
                          WEEK: '本周',
                          MONTH: '五月',
                        }[this.state.showingRecordsOf]
                      }
                      累积里程:
                      {sum(team.showingRecords.map(r => r.hundreds)) / 10} km
                    </p>
                    {this.state.showingRecordsOf === 'DAY' ? (
                      sortRecords(team.showingRecords).map(record => (
                        <Record key={record.id} record={record} />
                      ))
                    ) : (
                      <>
                        <p>排行榜：</p>
                        <div>
                          {_.orderBy(
                            team.users.map(u => ({
                              ...u,
                              total: sum(
                                team.showingRecords
                                  .filter(r => r.user.id === u.id)
                                  .map(r => r.hundreds)
                              ),
                            })),
                            [u => u.total, u => u.name],
                            ['desc', 'asc']
                          ).map(user => (
                            <div
                              key={user.id}
                              style={{
                                margin: '10px 0',
                                display: 'flex',
                                flexFlow: 'row nowrap',
                                justifyContent: 'space-between',
                              }}
                            >
                              <User user={user} />
                              <div
                                style={{ lineHeight: 1, textAlign: 'right' }}
                              >
                                {user.name}
                                <br />
                                <span style={{ fontSize: '2em' }}>
                                  {user.total / 10}
                                </span>{' '}
                                km
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </Well>
                </div>
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
