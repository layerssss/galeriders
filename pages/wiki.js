import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'react-bootstrap';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Layout from '../components/Layout.js';
import Markdown from '../components/Markdown.js';
import data from '../lib/data.js';

@data
@graphql(
  gql`
    query($title: String!) {
      wiki_item(title: $title) {
        id
        title
        content
        aliases
        updated_at
      }
    }
  `,
  {
    options: ({ title }) => ({
      variables: {
        title,
      },
    }),
  }
)
class WikiPage extends React.Component {
  static async getInitialProps({ query: { name } }) {
    return {
      title: name,
    };
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
  };

  render() {
    const {
      title,
      data: { wiki_item },
    } = this.props;

    return (
      <Layout pageTitle={`“${title}”`} categoryTitle="风车大百科">
        {wiki_item && (
          <>
            <p>
              别名：
              {wiki_item.aliases.map(alias => (
                <Label bsStyle="info" style={{ margin: 5 }} key={alias}>
                  {alias}
                </Label>
              ))}
            </p>
            <div
              style={{
                display: 'flex',
                flexFlow: 'row nowrap',
              }}
            >
              <span
                style={{
                  fontSize: '5em',
                  color: '#ccc',
                  alignSelf: 'flex-start',
                }}
              >
                “
              </span>
              <Markdown
                style={{
                  fontSize: '1.3em',
                  maxWidth: 600,
                  margin: 20,
                }}
                source={wiki_item.content}
              />
              <span
                style={{
                  fontSize: '5em',
                  color: '#ccc',
                  alignSelf: 'flex-end',
                }}
              >
                ”
              </span>
            </div>
          </>
        )}
      </Layout>
    );
  }
}

export default WikiPage;
