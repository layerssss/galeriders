import { compose, lifecycle } from "recompose";
import uuid from "uuid";

const Spinner = compose(
  lifecycle({
    componentDidMount: function() {
      const id = uuid.v4();
      this.id = id;
      window.dispatchEvent(new CustomEvent("spinnerstart", { detail: { id } }));
    },

    componentWillUnmount: function() {
      const id = this.id;
      window.dispatchEvent(new CustomEvent("spinnerstop", { detail: { id } }));
    }
  })
)(() => null);

export default Spinner;
