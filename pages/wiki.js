import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Label,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
} from 'react-bootstrap';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Time from '../components/Time.js';
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
        updated_by_user {
          id
          full_name
        }

        revisions {
          id
          created_at
          updated_by_user {
            id
            full_name
          }
        }
      }
      current_user {
        id
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
@graphql(
  gql`
    mutation($title: String!, $aliases: [String!]!, $content: String!) {
      update_wiki_item(title: $title, aliases: $aliases, content: $content) {
        id
        aliases
        content
        updated_at
        updated_by_user {
          id
          full_name
        }
        revisions {
          id
          content
          created_at
          updated_by_user {
            id
          }
        }
      }
    }
  `,
  { name: 'update_wiki_item' }
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
    update_wiki_item: PropTypes.func.isRequired,
  };

  static contextTypes = {
    useSpinner: PropTypes.func.isRequired,
  };

  state = {
    editing: false,
  };

  render() {
    const {
      title,
      data: { wiki_item, current_user },
      update_wiki_item,
    } = this.props;

    const { useSpinner } = this.context;

    return (
      <Layout pageTitle={`“${title}”`} categoryTitle="风车大百科">
        {wiki_item && (
          <>
            {!this.state.editing && (
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
                <p>
                  <Time time={wiki_item.updated_at} /> 由{' '}
                  {wiki_item.updated_by_user.full_name} 编辑{' '}
                  {current_user && (
                    <a
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        this.setState({ editing: true });
                      }}
                    >
                      修改
                    </a>
                  )}
                </p>
              </>
            )}
            {this.state.editing && (
              <form
                onSubmit={event => {
                  event.preventDefault();
                  const formElement = event.currentTarget;
                  useSpinner(async () => {
                    const aliases = formElement
                      .querySelector('[name="aliases"]')
                      .value.split(',')
                      .map(a => a.trim())
                      .filter(a => a);
                    const content = formElement.querySelector(
                      '[name="content"]'
                    ).value;

                    await update_wiki_item({
                      variables: {
                        title: wiki_item.title,
                        aliases,
                        content,
                      },
                    });

                    this.setState({ editing: false });
                  });
                }}
              >
                <FormGroup controlId="aliases">
                  <ControlLabel>别名:</ControlLabel>
                  <FormControl
                    type="text"
                    name="aliases"
                    defaultValue={wiki_item.aliases.join(', ')}
                  />
                  <HelpBlock>用半角逗号(,)分隔</HelpBlock>
                </FormGroup>
                <FormGroup controlId="content">
                  <ControlLabel>内容:</ControlLabel>
                  <FormControl
                    componentClass="textarea"
                    name="content"
                    defaultValue={wiki_item.content}
                    rows={10}
                  />
                  <HelpBlock>
                    支持{' '}
                    <a href="https://zh.wikipedia.org/zh-hans/Markdown">
                      Markdown 格式
                    </a>
                  </HelpBlock>
                </FormGroup>
                <FormGroup>
                  <Button type="submit" bsStyle="primary">
                    保存
                  </Button>{' '}
                  <Button onClick={() => this.setState({ editing: false })}>
                    取消
                  </Button>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>修改记录：</ControlLabel>
                  {wiki_item.revisions.map(revision => (
                    <p key={revision.id}>
                      <Time time={revision.created_at} /> 由{' '}
                      {revision.updated_by_user.full_name} 编辑
                    </p>
                  ))}
                </FormGroup>
              </form>
            )}
          </>
        )}
      </Layout>
    );
  }
}

export default WikiPage;
