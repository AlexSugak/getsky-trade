import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import styled, { injectGlobal, ThemeProvider } from 'styled-components';
import { Flex } from 'grid-styled';

import Routes from './routes/Routes';
import Header from './layout/Header';
import Footer from './layout/Footer';
import AppInitializer from './AppInitializer';

import theme from './theme';
import store, { history } from '../store';
import { registerApiInterceptor } from '../api/requestInterceptor';

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

registerApiInterceptor(store);

const Root = ({ locale, ...props }) => (
    <ThemeProvider theme={theme}>
        <AppInitializer>
            <Wrapper flexDirection="column">
                <Header />
                <Routes {...props} />
                <Footer />
            </Wrapper>
        </AppInitializer>
    </ThemeProvider>
);

const ScrollToTop = withRouter(class extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }
    }
    render() {
        return this.props.children
    }
})

export default () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <ScrollToTop>
                <Switch>
                    <Route path="/" render={props => <Root {...props} locale="en" />} />
                </Switch>
            </ScrollToTop>
        </ConnectedRouter>
    </Provider>
);
