import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled, { injectGlobal } from 'styled-components';
import { Flex } from 'grid-styled';
import Routes from './routes/Routes';
import Container from './layout/Container';
import Header from './layout/Header';
import Footer from './layout/Footer';

import skycoinLight from './Skycoin-Light.woff';
import skycoinBold from './Skycoin-Bold.woff';

injectGlobal`
  @font-face {
    font-family: 'skycoin-light';
    src: url(${skycoinLight}) format('woff');
    font-weight: normal;
  }
  
    @font-face {
    font-family: 'skycoin-bold';
    src: url(${skycoinBold}) format('woff');
    font-weight: normal;
  }
  
  * {
    box-sizing: border-box;
  }
    
  body {
    margin: 0;
    padding: 0;
    font-family: 'skycoin-light', Arial, Helvetica, sans-serif;
    color: #000;
  }
  
  ul {
    margin: 0;
    padding: 0;
  }
  a {
    color: #000;
    text-decoration: none;
  }
`;

const Wrapper = styled(Flex)`
    min-height: 100vh;
`;

const Root = ({locale, ...props}) => (
    <Wrapper className="app" flexDirection="column">
        <Header/>
        <Container flex='1 0 auto' flexDirection="column" py={4}>
            <Routes {...props} />
        </Container>
        <Footer />
    </Wrapper>
);

export default () => (
    <Router>
        <Switch>
            <Route path="/" render={props => <Root {...props} locale="en"/>}/>
        </Switch>
    </Router>
);
