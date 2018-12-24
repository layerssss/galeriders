import { compose, withProps } from "recompose";
import { graphql } from "react-apollo";

import useSpinner from "../helpers/useSpinner";

const withMutation = (query, name, refetchQuery = null) =>
  compose(
    graphql(query, {
      name
    }),
    withProps(({ [name]: mutate }) => ({
      [name]: variables =>
        useSpinner(async () => {
          const result = await mutate({
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

          return result;
        })
    }))
  );

export default withMutation;
