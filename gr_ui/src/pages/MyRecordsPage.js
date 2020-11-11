import React from "react";
import { compose, withState } from "recompose";
import {
  Alert,
  Panel,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  Radio,
  Image
} from "react-bootstrap";
import gql from "graphql-tag";

import uploadFile from "../helpers/uploadFile";
import moment from "../helpers/moment";
import withData from "../helpers/withData";
import withMutation from "../helpers/withMutation";

import Team from "../components/Team";
import Record from "../components/Record";
import User from "../components/User";

export default compose(
  withData(gql`
    query {
      all_teams {
        id
        name
      }
      month
      current_user {
        id
        full_name
        team {
          id
        }
        day_records {
          id
        }
        month_records {
          id
        }
      }
    }
  `),
  withMutation(
    gql`
      mutation($hundreds: Int!, $picture_url: String!) {
        create_record(hundreds: $hundreds, picture_url: $picture_url) {
          id
          time
          hundreds
          picture_url
          user {
            id
            day_total_hundreds
            month_total_hundreds
            day_records {
              id
            }
          }
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
        }
      }
    `,
    "createRecord"
  ),
  withMutation(
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
    "joinTeam"
  ),
  withState("creatingRecord", "setCreatingRecord", false),
  withState("picture", "setPicture", null)
)(
  ({
    data,
    joinTeam,
    createRecord,
    creatingRecord,
    setCreatingRecord,
    picture,
    setPicture
  }) => (
    <>
      {!data.current_user && (
        <>
          <Alert bsStyle="warning">请点击页面右上角的按钮登陆</Alert>
        </>
      )}
      {data.current_user && (
        <>
          {!data.current_user.team && (
            <Panel>
              <Panel.Body>
                <Alert bsStyle="warning">
                  你还没有选择队伍，请选择队伍，选择后不能换哈：
                </Alert>
                <Form
                  onSubmit={async event => {
                    event.preventDefault();
                    const formElement = event.currentTarget;
                    const selectedElement = formElement.querySelector(
                      'input[name="team"]:checked'
                    );
                    if (!selectedElement) return;
                    if (!window.confirm("选择队伍后无法更换，确定哈？")) return;

                    await joinTeam({
                      teamId: selectedElement.value
                    });
                  }}
                >
                  <FormGroup>
                    {data.all_teams.map(team => (
                      <React.Fragment key={team.id}>
                        <Radio name="team" value={team.id} inline>
                          {team.name}
                        </Radio>{" "}
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
          {data.current_user.team && (
            <Team
              header={
                <div>
                  <User id={data.current_user.id} />
                  {data.current_user.full_name}
                </div>
              }
              id={data.current_user.team.id}
            >
              {moment().isSame(data.month, "month") ? (
                <div style={{ padding: 10 }}>
                  <p>我今天的记录：</p>
                  {!data.current_user.day_records.length ? (
                    <Alert bsStyle="warning">我今天还没跑步呢</Alert>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexFlow: "row wrap"
                      }}
                    >
                      {data.current_user.day_records.map(record => (
                        <div
                          key={record.id}
                          style={{
                            width: 240,
                            margin: 5
                          }}
                        >
                          <Record id={record.id} />
                        </div>
                      ))}
                    </div>
                  )}
                  <hr />
                  {!creatingRecord ? (
                    <Button onClick={() => setCreatingRecord(true)}>
                      <span className="fa fa-plus" />
                      添加记录
                    </Button>
                  ) : (
                    <Form
                      onSubmit={async event => {
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
                          return alert("公里数无效哈");

                        if (!picture)
                          return alert("请上传个屏幕截图或者照片哈");

                        if (
                          !window.confirm(
                            "记录添加后无法更改或删除，请确认哈。(注意：务必仅上传当天的跑步记录，如果有之前的跑步记录需要补上传请联系头哥手动更改时间。)"
                          )
                        )
                          return;

                        const { url: picture_url } = await uploadFile(
                          picture.file
                        );

                        await createRecord({
                          hundreds,
                          picture_url
                        });

                        setPicture(null);
                        setCreatingRecord(false);
                        form.reset();
                      }}
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

                            setPicture({ file, fileURI });
                          }}
                        />
                        {picture && (
                          <Image
                            src={picture.fileURI}
                            alt="选择的图片"
                            style={{ width: 230 }}
                          />
                        )}
                      </FormGroup>

                      <FormGroup>
                        <Button bsStyle="primary" type="submit">
                          <span className="fa fa-plus" />
                          添加记录
                        </Button>{" "}
                        <Button onClick={() => setCreatingRecord(false)}>
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
                      display: "flex",
                      flexFlow: "row wrap"
                    }}
                  >
                    {data.current_user.month_records.map(record => (
                      <div
                        key={record.id}
                        style={{
                          width: 240,
                          margin: 5
                        }}
                      >
                        <Record id={record.id} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Team>
          )}
        </>
      )}
    </>
  )
);
