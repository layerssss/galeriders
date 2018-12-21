import React from "react";
import { markdown } from "markdown";

export default ({ source, ...others }) => (
  <div
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: markdown.toHTML(source || "") }}
    {...others}
  />
);
