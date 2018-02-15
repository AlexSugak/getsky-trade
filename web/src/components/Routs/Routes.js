import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import LatestAdverts from '../LatestAdverts';
import SearchAdverts from '../SearchAdverts';

const Routes = ({ match }) => {
  return (
    <Switch>
      <Route path={`/search`} component={SearchAdverts} />
      <Route path={`/`} component={LatestAdverts} />
    </Switch>
  );
};

Routes.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Routes;