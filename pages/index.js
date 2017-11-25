import React from 'react';
import { Button } from 'material-ui';
import withMui from '../components/withMui.js';

@withMui
class Page extends React.Component {
  render() {
    return (
      <div>
        <Button>TODO</Button>
      </div>
    );
  }
}

export default Page;
