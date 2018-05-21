import React from 'react';
import PropTypes from 'prop-types';

class Team extends React.Component {
  static propTypes = {
    team: PropTypes.object.isRequired,
    children: PropTypes.any,
    header: PropTypes.any,
  };

  render() {
    const { team, children, header } = this.props;

    return (
      <div
        style={{
          position: 'relative',
        }}
      >
        <div
          style={{
            position: header ? 'relative' : 'absolute',
            left: 0,
            right: 0,
            maxHeight: 150,
            ...(team.cover && {
              backgroundImage: `url(${team.cover.url})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }),
          }}
        >
          <div
            style={{
              paddingTop: '80%',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(transparent, #f9f9f9)`,
              textIndent: -9999,
            }}
          >
            {team.name}:
          </div>
          {header && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textShadow: '0 0 20px black',
              }}
            >
              {header}
            </div>
          )}
        </div>
        <div
          style={{
            position: 'relative',
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default Team;
