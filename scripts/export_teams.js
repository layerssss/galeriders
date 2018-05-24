const gql = require('graphql-tag');

const client = require('./client.js');

Promise.resolve()
  .then(async () => {
    const {
      data: { teams },
    } = await client.query({
      query: gql`
        query {
          teams: allTeams {
            name
            order
            color
            cover {
              url
            }
            published
            users {
              auth0UserId
              name
              isAdmin
              description
              records {
                date
                hundreds
                file {
                  url
                }
              }
            }
          }
        }
      `,
    });

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(teams));
  })
  .then(() => process.exit(0))
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error(error.stack);
    process.exit(1);
  });
