import { compose, branch, renderComponent } from "recompose";
import { graphql } from "react-apollo";

import Spinner from "../components/Spinner";

const withData = (query, getVariables = () => ({})) =>
  compose(
    graphql(query, {
      options: props => ({
        partialRefetch: true,
        errorPolicy: "all",
        variables: getVariables(props)
      })
    }),
    branch(({ data }) => data.loading, renderComponent(Spinner)),
    branch(
      ({ data }) => data.error,
      renderComponent(({ data: { error } }) => `Error: ${error.message}`)
    )
  );

export default withData;
