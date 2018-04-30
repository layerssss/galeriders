const { ApolloClient, HttpLink, InMemoryCache } = require('apollo-boost');
const gql = require('graphql-tag');
const assert = require('assert');
const fetch = require('isomorphic-unfetch');
const randomNumber = require('random-number-csprng');

Promise.resolve()
  .then(async () => {
    const { GALERIDERS_GRAPHCOOL_TOKEN } = process.env;
    assert(GALERIDERS_GRAPHCOOL_TOKEN);

    const client = new ApolloClient({
      link: new HttpLink({
        fetch,
        uri: 'https://api.graph.cool/simple/v1/cjgjy05nx0k4q01860p3k1dzl',
        headers: {
          Authorization: `Bearer ${GALERIDERS_GRAPHCOOL_TOKEN}`,
        },
      }),
      cache: new InMemoryCache(),
    });

    const { data: { allUsers, allTeams } } = await client.query({
      query: gql`
        query {
          allUsers {
            id
            name
            team {
              id
              name
            }
          }
          allTeams {
            id
            name
            published
          }
        }
      `,
    });
    const teams = allTeams.filter(t => t.name !== '准备分组');
    const users = allUsers;
    // const users.filter(u => !u.team || u.team.name === '准备分组');

    const teamSelections = [];
    for (const user of users) {
      const teamIndex = await randomNumber(0, teams.length - 1);
      const team = teams[teamIndex];
      // eslint-disable-next-line no-console
      console.log(`${user.name}: ${team.name}`);

      if (user.name === 'Chen Sophie' && !team.name.startsWith('白虎'))
        throw new Error('反正她要白虎队，别的她不管，重来');

      teamSelections.push({ user, team });
    }

    for (const { user, team } of teamSelections) {
      await client.mutate({
        mutation: gql`
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
        variables: {
          teamId: team.id,
          userId: user.id,
        },
      });
    }
  })
  .then(() => process.exit(0))
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error(error.stack);
    process.exit(1);
  });
