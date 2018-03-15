import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import styled, { injectGlobal, ThemeProvider } from 'styled-components';
import { Flex } from 'grid-styled';
import Routes from './routes/Routes';
import Header from './layout/Header';
import Footer from './layout/Footer';
import theme from './theme';
import store, { history } from '../store';

import skycoinLight from '../fonts/Skycoin-Light.woff';
import skycoinBold from '../fonts/Skycoin-Bold.woff';

injectGlobal`
  @font-face {
    font-family: ${theme.fontLight};
    src: url(${skycoinLight}) format('woff');
    font-weight: normal;
  }
  
    @font-face {
    font-family: ${theme.fontBold};
    src: url(${skycoinBold}) format('woff');
    font-weight: normal;
  }
  
  * {
    box-sizing: border-box;
  }
    
  body {
    margin: 0;
    padding: 0;
    font-family: ${theme.fontLight}, Arial, Helvetica, sans-serif;
    color: ${theme.black};
  }
  
  ul {
    margin: 0;
    padding: 0;
  }
  a {
    color: ${theme.colors.black};
    text-decoration: none;
  }
`;

const Wrapper = styled(Flex) `
    min-height: 100vh;
`;

const Root = ({ locale, ...props }) => (
    <ThemeProvider theme={theme}>
        <Wrapper className="app" flexDirection="column">
            <Header />
            <Routes {...props} />
            <Footer />
        </Wrapper>
    </ThemeProvider>
);

export default () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Router>
                <Switch>
                    <Route path="/" render={props => <Root {...props} locale="en" />} />
                </Switch>
            </Router>
        </ConnectedRouter>
    </Provider>
);
