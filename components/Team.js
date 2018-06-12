import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';

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
          boxShadow: `0 2px 10px ${tinycolor(team.color)
            .darken(50)
            .toString()}`,
        }}
      >
        <div
          style={{
            position: header ? 'relative' : 'absolute',
            left: 0,
            right: 0,
            maxHeight: 150,
            backgroundImage: `url(${team.cover_url})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
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
            background: `linear-gradient(#f9f9f9, ${tinycolor(team.color)
              .setAlpha(0.5)
              .toString()})`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default Team;
