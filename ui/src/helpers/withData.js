import { compose, branch, renderNothing, renderComponent } from "recompose";
import { graphql } from "react-apollo";

const withData = (query, getVariables = () => ({})) =>
  compose(
    graphql(query, {
      options: props => ({
        partialRefetch: true,
        errorPolicy: "all",
        variables: getVariables(props)
      })
    }),
    branch(({ data }) => data.loading, renderNothing),
    branch(
      ({ data }) => data.error,
      renderComponent(({ data: { error } }) => `Error: ${error.message}`)
    )
  );

export default withData;
