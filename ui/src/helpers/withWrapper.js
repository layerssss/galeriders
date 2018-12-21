import React from "react";

const withWrapper = (
  WrapperComponent,
  wrapperProps = {}
) => BaseComponent => props => (
  <WrapperComponent
    {...(wrapperProps.constructor === Function
      ? wrapperProps(props)
      : wrapperProps)}
  >
    <BaseComponent {...props} />
  </WrapperComponent>
);

export default withWrapper;
