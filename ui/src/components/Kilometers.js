import React from "react";
import PropTypes from "prop-types";
import { compose, setPropTypes } from "recompose";

export default compose(
  setPropTypes({
    hundreds: PropTypes.number.isRequired
  })
)(({ hundreds }) => (
  <>
    <span style={{ fontSize: "2em" }}>{(hundreds / 10).toFixed(1)}</span> km
  </>
));
