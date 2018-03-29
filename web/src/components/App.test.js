import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../__mocks__/mock-localstorage';
import { getStatesOk, getCountriesOk, getUserInfoApiOk, getSkycoinPriceOk } from '../__mocks__/api';
import * as api from '../api';

jest.mock('../api');

it('renders without crashing', () => {
    api.getStates = getStatesOk;
    api.getCountries = getCountriesOk;
    api.getUserInfo = getUserInfoApiOk;
    api.getSkycoinPrice = getSkycoinPriceOk('EUR');

    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});
