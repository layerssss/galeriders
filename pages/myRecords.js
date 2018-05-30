import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import {
  Button,
  Panel,
  Alert,
  Form,
  FormGroup,
  Image,
  Radio,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';

import data from '../lib/data.js';
import may from '../lib/may.js';
import Layout from '../components/Layout.js';
import uploadFile from '../lib/uploadFile.js';
import Record from '../components/Record.js';
import User from '../components/User.js';
import Team from '../components/Team.js';
import getDayRecords from '../lib/getDayRecords.js';
import getMonthRecords from '../lib/getMonthRecords.js';
import moment from '../lib/moment.js';
import withUser from '../lib/withUser.js';

@data
@withUser
@graphql(
  gql`
    query {
      allTeams {
        id
        name
        published
        order
        color
        cover {
          id
          url
        }
      }
      user {
        id
        name
        auth0UserId
        team {
          id
          name
          color
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
class MyRecords extends React.Component {
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
  };

  render() {
    const {
      data: { allTeams, user: currentUser },
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
      <Layout>
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
              <Team
                header={
                  <div>
                    <User user={currentUser} />
                    {currentUser.name}
                  </div>
                }
                team={currentUser.team}
              >
                {moment().isSame(may, 'month') ? (
                  <div style={{ padding: 10 }}>
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
                            if (!file)
                              return alert('请上传个屏幕截图或者照片哈');

                            if (
                              !window.confirm(
                                '记录添加后无法更改或删除，请确认哈。(注意：务必仅上传当天的跑步记录，如果有之前的跑步记录需要补上传请联系头哥手动更改时间。)'
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
                              const file = event.target.files[0];

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
                  </div>
                ) : (
                  <div style={{ padding: 10 }}>
                    <p>我的记录：</p>
                    <div
                      style={{
                        display: 'flex',
                        flexFlow: 'row wrap',
                      }}
                    >
                      {sortRecords(getMonthRecords(currentUser.records)).map(
                        record => (
                          <div
                            key={record.id}
                            style={{
                              width: 240,
                              margin: 5,
                            }}
                          >
                            <Record record={{ ...record, user: currentUser }} />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </Team>
            )}
          </>
        )}
      </Layout>
    );
  }
}

export default MyRecords;
