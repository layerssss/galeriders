import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Alert } from 'react-bootstrap';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import Record from '../components/Record';
import Team from '../components/Team';
import User from '../components/User';
import Kilometers from '../components/Kilometers';
import moment from '../lib/moment.js';

@data
@graphql(
  gql`
    query {
      month
      all_teams {
        id
        name
        color
        cover_url

        month_total_hundreds
        day_total_hundreds
      }

      all_day_records {
        id
        hundreds
        time
        picture_url
        user {
          id
          full_name
          picture_url
        }
        team {
          id
          color
          cover_url
        }
      }
    }
  `
)
class May extends React.Component {
  static async getInitialProps() {
    return {};
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    const {
      data: { all_teams, month, all_day_records },
    } = this.props;

    return (
      <Layout>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {all_teams &&
            all_teams.map(team => (
              <div
                key={team.id}
                style={{
                  width: 240,
                  margin: 5,
                  flex: '1 0 auto',
                }}
              >
                <Team
                  team={team}
                  header={
                    <div>
                      <span style={{ fontSize: 20 }}>
                        <Kilometers hundreds={team.month_total_hundreds} />
                      </span>
                      {moment().isSame(month, 'month') && (
                        <>
                          <br />
                          今天累积里程:
                          <Kilometers hundreds={team.day_total_hundreds} />
                        </>
                      )}
                    </div>
                  }
                />
              </div>
            ))}
        </div>
        <hr />
        {!moment().isSame(month, 'month') && (
          <Alert bsStyle="success">
            五月挑战目前已经结束，看看五月志和琅琊榜吧。
          </Alert>
        )}
        {month &&
          all_day_records &&
          moment().isSame(month, 'month') && (
            <div style={{ padding: 5, display: 'flex', flexFlow: 'row wrap' }}>
              {all_day_records.map(record => (
                <div
                  key={record.id}
                  style={{ width: 170, flex: '0 0 auto', margin: '20px auto' }}
                >
                  <Team header={<User user={record.user} />} team={record.team}>
                    <div style={{ padding: 10 }}>
                      <Record showUser={false} record={record} />
                    </div>
                  </Team>
                </div>
              ))}
            </div>
          )}
      </Layout>
    );
  }
}

export default May;
