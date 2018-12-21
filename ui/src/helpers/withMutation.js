import { compose, withProps } from "recompose";
import { graphql } from "react-apollo";

const withMutation = (query, name, refetchQuery = null) =>
  compose(
    graphql(query, {
      name
    }),
    withProps(({ [name]: mutate }) => ({
      [name]: async variables => {
        await mutate({
          variables,
          errorPolicy: "all",
          awaitRefetchQueries: true,
          refetchQueries: !refetchQuery
            ? []
            : [
                {
                  query: refetchQuery
                }
              ]
        });
      }
    }))
  );

export default withMutation;
