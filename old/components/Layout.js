import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import ReactGA from 'react-ga';
import { Button, Nav, NavItem } from 'react-bootstrap';

ReactGA.initialize('UA-80409715-5');

Router.onRouteChangeStart = () => {
  window.NProgress.start();
};

Router.onRouteChangeComplete = () => {
  window.NProgress.done();
  window.NProgress.remove();
};

@withRouter
class Layout extends React.Component {
  static propTypes = {
    pageTitle: PropTypes.string,
    categoryTitle: PropTypes.string,
    router: PropTypes.object.isRequired,
    children: PropTypes.any,
  };

  static defaultProps = {
    pageTitle: '',
    categoryTitle: '',
  };

  static contextTypes = {
    current_user: PropTypes.object,
    all_teams: PropTypes.array,
    login: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      small: false,
    };
  }

  componentDidMount() {
    ReactGA.pageview(document.location.href);
    if (window.innerWidth < 640)
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ small: true });
  }

  render() {
    const { children, router } = this.props;
    let { pageTitle, categoryTitle } = this.props;
    const { current_user, login, all_teams } = this.context;

    const featuredItems = ['Galeriders', '五月挑战'];

    const categories = [
      {
        title: '风车大百科',
        pages: [
          { title: '所有词条', pathname: '/' },
          ...featuredItems.map(item => ({
            title: `“${item}”`,
            pathname: '/wiki',
            query: {
              name: item,
            },
          })),
        ],
      },
      {
        title: '五月挑战',
        pages: [
          {
            title: '战况',
            pathname: '/may',
          },
          {
            title: '我的记录',
            pathname: '/myRecords',
          },
          {
            title: '五月志',
            pathname: '/timeline',
          },
          {
            title: '琅琊榜',
            pathname: '/leaderBoard',
          },
          ...(all_teams || []).map(team => ({
            title: team.name,
            pathname: '/team',
            query: {
              id: team.id,
            },
          })),
        ],
      },
    ];

    for (const category of categories)
      for (const page of category.pages)
        page.asPath = `${page.pathname}?${Object.entries(page.query || {})
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&')}`.replace(/\?$/, '');

    {
      const allPages = [].concat(
        ...categories.map(c => c.pages.map(p => ({ ...p, category: c })))
      );

      const page = allPages.find(p => p.asPath === router.asPath);

      if (page) {
        pageTitle = pageTitle || page.title;
        categoryTitle = categoryTitle || page.category.title;
      } else if (pageTitle && categoryTitle) {
        const category = categories.find(c => c.title === categoryTitle);
        if (category)
          category.pages.push({
            title: pageTitle,
            pathname: router.pathname,
            query: router.query,
            asPath: router.asPath,
          });
      }
    }

    pageTitle = pageTitle || '大风车';

    const currentCategory = categories.find(c => c.title === categoryTitle);

    return (
      <div
        style={{
          maxWidth: 1024,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <Head>
          <title>
            {pageTitle} - {categoryTitle}
          </title>
        </Head>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            ...(this.state.small
              ? {
                  fontSize: 32,
                  justifyContent: 'center',
                }
              : {
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  fontSize: 32,
                  lineHeight: 1,
                }),
          }}
        >
          <a href="https://www.facebook.com/galeriders/">
            <span
              className="fa fa-fw fa-facebook-official"
              style={{ color: '#4267b2' }}
            >
              <span className="sr-only">Facebook</span>
            </span>
          </a>
          <a href="https://www.facebook.com/galeriders/">
            <span className="fa fa-fw fa-weixin" style={{ color: '#44b549' }}>
              <span className="sr-only">微信</span>
            </span>
          </a>
          <a href="https://www.strava.com/clubs/galeriders">
            <img
              style={{ width: '.9em', position: 'relative', top: '-.1em' }}
              src="/static/icon_strava.jpg"
              alt="Strava"
            />
          </a>
          <a href="https://github.com/layerssss/galeriders">
            <span className="fa fa-github" style={{ color: '#444' }}>
              <span className="sr-only">GitHub</span>
            </span>
          </a>
          <span
            style={{
              fontSize: 18,
              textAlign: 'right',
              margin: '0 10px',
            }}
          >
            {!current_user ? (
              <Button onClick={() => login()}>
                <span className="fa fa-user" />登录
              </Button>
            ) : (
              <React.Fragment>
                <Button active>
                  {' '}
                  <img
                    style={{
                      height: '2em',
                      width: '2em',
                    }}
                    src={current_user.picture_url}
                    alt={`${current_user.name}的照片`}
                  />
                  {current_user.name}
                </Button>
              </React.Fragment>
            )}
          </span>
        </div>
        <div
          style={{
            padding: 10,
            display: 'flex',
            flexFlow: 'row wrap',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Link href="/">
            <a
              style={{
                width: 80,
                maxWidth: '10vw',
                marginRight: 20,
              }}
            >
              <img
                style={{
                  width: '100%',
                }}
                src="/static/logo.png"
                alt="大风车"
              />
            </a>
          </Link>
          <div>
            <h2 style={{ fontSize: '2em', margin: '5px 0' }}>
              {categoryTitle}
            </h2>
            <h1 style={{ fontSize: '1em', color: '#888', margin: 0 }}>
              {pageTitle}
            </h1>
          </div>
        </div>
        <div style={{ padding: 10 }}>
          <Nav bsStyle="tabs">
            {categories.map(category => (
              <NavItem
                active={categoryTitle === category.title}
                key={category.title}
                title={category.title}
                href={category.pages[0].asPath}
                onClick={event => {
                  event.preventDefault();

                  Router.push({
                    pathname: category.pages[0].pathname,
                    query: category.pages[0].query,
                  });
                }}
              >
                {category.title}
              </NavItem>
            ))}
          </Nav>
        </div>
        {currentCategory && (
          <div
            style={{
              padding: 10,
            }}
          >
            <Nav bsStyle="pills">
              {currentCategory.pages.map(page => (
                <NavItem
                  active={pageTitle === page.title}
                  key={page.title}
                  title={page.title}
                  href={page.asPath}
                  onClick={event => {
                    event.preventDefault();

                    Router.push({
                      pathname: page.pathname,
                      query: page.query,
                    });
                  }}
                >
                  {page.title}
                </NavItem>
              ))}
            </Nav>
          </div>
        )}
        <div
          style={{
            padding: 10,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default Layout;
