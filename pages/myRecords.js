import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
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
import moment from '../lib/moment.js';
import withUser from '../lib/withUser.js';

@data
@withUser
@graphql(
  gql`
    query {
      all_teams {
        id
        name
        color
        cover_url
      }
      current_user {
        id
        full_name
        picture_url
        team {
          id
          name
          color
          cover_url
        }
        day_records {
          id
          hundreds
          time
          picture_url
          user {
            id
            full_name
            picture_url
          }
        }
        month_records {
          id
          hundreds
          time
          picture_url
          user {
            id
            full_name
            picture_url
          }
        }
      }
    }
  `
)
@graphql(
  gql`
    mutation($teamId: ID!) {
      join_team(id: $teamId) {
        id
        team {
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
    mutation($hundreds: Int!, $picture_url: String!) {
      create_record(hundreds: $hundreds, picture_url: $picture_url) {
        id
        user {
          id
          day_total_hundreds
          month_total_hundreds
          team {
            id
            day_total_hundreds
            month_total_hundreds
            day_records {
              id
            }
            month_records {
              id
            }
          }
          day_records {
            id
          }
        }
      }
    }
  `,
  { name: 'createRecord' }
)
class MyRecords extends React.Component {
  static async getInitialProps() {
    return {};
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    joinTeam: PropTypes.func.isRequired,
    createRecord: PropTypes.func.isRequired,
  };

  static contextTypes = {
    useSpinner: PropTypes.func.isRequired,
  };

  state = {
    creatingRecord: false,
  };

  render() {
    const {
      data: { all_teams, current_user },
      joinTeam,
      createRecord,
    } = this.props;
    const { useSpinner } = this.context;

    return (
      <Layout>
        {current_user && (
          <>
            {!current_user.team && (
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
                          },
                        });
                      })
                    }
                  >
                    <FormGroup>
                      {all_teams.map(team => (
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
                </Panel.Body>
              </Panel>
            )}
            {current_user.team && (
              <Team
                header={
                  <div>
                    <User user={current_user} />
                    {current_user.full_name}
                  </div>
                }
                team={current_user.team}
              >
                {moment().isSame(may, 'month') ? (
                  <div style={{ padding: 10 }}>
                    <p>我今天的记录：</p>
                    {!current_user.day_records.length ? (
                      <Alert bsStyle="warning">我今天还没跑步呢</Alert>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexFlow: 'row wrap',
                        }}
                      >
                        {current_user.day_records.map(record => (
                          <div
                            key={record.id}
                            style={{
                              width: 240,
                              margin: 5,
                            }}
                          >
                            <Record record={record} />
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

                            const { url: picture_url } = await uploadFile(file);

                            await createRecord({
                              variables: {
                                hundreds,
                                picture_url,
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
                      {current_user.month_records.map(record => (
                        <div
                          key={record.id}
                          style={{
                            width: 240,
                            margin: 5,
                          }}
                        >
                          <Record record={record} />
                        </div>
                      ))}
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
