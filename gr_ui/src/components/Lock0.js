import Auth0Lock from "auth0-lock";
import PropTypes from "prop-types";
import { compose, lifecycle, setPropTypes } from "recompose";

export default compose(
  setPropTypes({
    onLogin: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }),
  lifecycle({
    componentDidMount: function() {
      const { onLogin, onCancel } = this.props;

      this.lock = new Auth0Lock(
        "5e6-38K1d7H5Lez-y8fcZyusyWVsKIGv",
        "galeriders.au.auth0.com",
        {
          rememberLastLogin: false,
          language: "zh",
          auth: {
            responseType: "token id_token",
            params: {
              scope: "openid profile"
            }
          }
        }
      );

      this.lock.show();

      this.lock.on("authenticated", result => {
        const token = result.idToken;

        onLogin({ token });
      });

      this.lock.on("hide", () => {
        onCancel();
      });
    },

    componentWillUnmount: function() {
      this.lock.hide();
    }
  })
)(({ data }) => null);
