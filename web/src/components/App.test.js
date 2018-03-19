import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../__mocks__/mock-localstorage';

jest.mock('../api')

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});
