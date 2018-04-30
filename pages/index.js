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
  Tooltip,
  OverlayTrigger,
  ControlLabel,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import uploadFile from '../lib/uploadFile.js';

const timezone = 'Pacific/Auckland';
moment.tz.setDefault(timezone);
moment.locale('zh-cn');

const sum = arr => arr.reduce((a, b) => a + b, 0);

@data
@graphql(
  gql`
    query {
      allTeams {
        id
        name
        published
        order
        users {
          id
          name
          picture
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
    creatingRecord: false,
    recordPictures: 'HIDDEN',
  };

  render() {
    const {
      data: { loading, allTeams, user: currentUser },
      joinTeam,
      addRecord,
    } = this.props;
    const { useSpinner } = this.context;

    const today = moment.tz(timezone);

    const myRecordsToday = !currentUser
      ? []
      : currentUser.records.filter(r => moment(r.date).isSame(today, 'day'));

    const sortTeams = teams => _.sortBy(teams, t => t.order);
    const sortUsers = users => _.sortBy(users, u => u.name);
    const sortRecords = records =>
      _.sortBy(records, r => moment(r.date).valueOf());

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
                <span className="fa fa-user">我的记录/添加记录</span>
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
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <p>我今天的记录：</p>
                  {!myRecordsToday.length ? (
                    <Alert bsStyle="warning">我今天还没跑步呢</Alert>
                  ) : (
                    sortRecords(myRecordsToday).map(record => (
                      <div key={record.id}>
                        <p>
                          {moment(record.date).format('LT')}:{' '}
                          {record.hundreds / 10} km
                        </p>
                        <p>
                          {record.file && (
                            <Image
                              src={record.file.url}
                              style={{ width: 230 }}
                            />
                          )}
                        </p>
                      </div>
                    ))
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
                            hundreds > 200
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
        <div style={{ textAlign: 'right' }}>
          <FormGroup>
            <ControlLabel>屏幕截图/照片：</ControlLabel>
            <ToggleButtonGroup
              type="radio"
              name="recordPictures"
              value={this.state.recordPictures}
              onChange={value => this.setState({ recordPictures: value })}
            >
              <ToggleButton value="HIDDEN">不显示</ToggleButton>
              <ToggleButton value="VISIBLE">显示</ToggleButton>
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
                monthRecords: team.records.filter(r =>
                  moment(r.date).isSame('2018-04-01', 'month')
                ),
              }))
              .map(team => ({
                ...team,
                weekRecords: team.monthRecords.filter(r =>
                  moment(r.date).isSame(today, 'week')
                ),
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
                    {sortRecords(team.weekRecords).map(record => (
                      <div
                        key={record.id}
                        style={{
                          padding: '10px 0',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                          }}
                        >
                          <Image
                            src={record.user.picture}
                            alt={record.user.name}
                            circle
                            style={{
                              width: 40,
                              height: 40,
                            }}
                          />
                          <div style={{ margin: '0 20px' }}>
                            <span style={{ fontSize: '2em' }}>
                              {record.hundreds / 10}
                            </span>{' '}
                            km
                          </div>
                        </div>
                        <div style={{ lineHeight: 1 }}>
                          ({record.user.name}于
                          {moment(record.date).format('dddd LT')})
                        </div>
                        <p>
                          {record.file &&
                            this.state.recordPictures === 'VISIBLE' && (
                              <Image
                                src={record.file.url}
                                style={{ width: 180 }}
                              />
                            )}
                        </p>
                      </div>
                    ))}
                    <p>所有队员：</p>
                    <div
                      style={{
                        display: 'flex',
                        flexFlow: 'row wrap',
                      }}
                    >
                      {sortUsers(team.users).map(user => (
                        <div
                          key={user.id}
                          style={{
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
