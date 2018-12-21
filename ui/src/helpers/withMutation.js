import { compose, withProps } from "recompose";
import { graphql } from "react-apollo";
import uuid from "uuid";

const withMutation = (query, name, refetchQuery = null) =>
  compose(
    graphql(query, {
      name
    }),
    withProps(({ [name]: mutate }) => ({
      [name]: async variables => {
        const id = uuid.v4();
        window.dispatchEvent(
          new CustomEvent("spinnerstart", { detail: { id } })
        );

        let result;
        try {
          result = await mutate({
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
        } catch (error) {
          window.dispatchEvent(
            new CustomEvent("spinnerstop", { detail: { id } })
          );
        }

        window.dispatchEvent(
          new CustomEvent("spinnerstop", { detail: { id } })
        );

        return result;
      }
    }))
  );

export default withMutation;
