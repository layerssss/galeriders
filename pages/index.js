import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Link from 'next/link';
import _ from 'lodash';
import {
  FormGroup,
  Well,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import Rank from '../components/Rank.js';
import Record from '../components/Record';
import getDayRecords from '../lib/getDayRecords.js';
import getMonthRecords from '../lib/getMonthRecords.js';
import getWeekRecords from '../lib/getWeekRecords.js';
import sum from '../lib/sum.js';
import moment from '../lib/moment.js';

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
    }
  `
)
class May extends React.PureComponent {
  static async getInitialProps() {
    return {};
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  state = {
    showingRecordsOf: 'DAY',
  };

  render() {
    const {
      data: { loading, allTeams },
    } = this.props;

    const sortTeams = teams => _.sortBy(teams, t => t.order);
    const sortRecords = records =>
      _.orderBy(records, [r => moment(r.date).valueOf()], ['desc']);

    return (
      <Layout>
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
                    u.records.map(r => ({
                      // wrap it
                      ...r,
                      user: { ...u },
                    }))
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
                weekRecords: getWeekRecords(team.records),
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
                      <Rank
                        users={team.users.map(u => ({ ...u, team }))}
                        records={team.showingRecords}
                      />
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
