import * as actions from './actions';
import reducer from './reducers';

describe('messages reducers', () => {
    describe('SET_MESSAGES_STATE', () => {
        it('should save specified state in the store', () => {
            const initialState = { state: actions.messageStates.users };
            const action = { type: actions.SET_MESSAGES_STATE, state: actions.messageStates.messages };
            const expectedState = { state: actions.messageStates.messages };

            expect(reducer(initialState, action)).toEqual(expectedState);
        });
    });

    describe('SET_MESSAGE_TEXT', () => {
        it('should save message text to the store', () => {
            const initialState = { messageText: '' };
            const text = 'message text';
            const action = { type: actions.SET_MESSAGE_TEXT, text };
            const expectedState = { messageText: text };

            expect(reducer(initialState, action)).toEqual(expectedState);
        });
    });

    describe('POST_MESSAGE_RESPONSE', () => {
        it('should save created message to the store', () => {
            const initialState = { messages: [], };
            const message = { body: 'messageBody', author: 'bob', id: 1 };
            const action = { type: actions.POST_MESSAGE_RESPONSE, message };
            const expectedState = { messages: [message], messageText: '', };

            expect(reducer(initialState, action)).toEqual(expectedState);
        });
    });

    describe('GET_MESSAGES_RESPONSE', () => {
        it('should save received messages to the store', () => {
            const initialState = { messages: [], };
            const messages = [{ body: 'messageBody', author: 'bob', id: 1 }];
            const action = { type: actions.GET_MESSAGES_RESPONSE, messages };
            const expectedState = { messages };

            expect(reducer(initialState, action)).toEqual(expectedState);
        });
    });

    describe('GET_MESSAGES_AUTHORS_RESPONSE', () => {
        it('should save received messages authors to the store', () => {
            const initialState = { authors: [], };
            const authors = [{ author: 'sam', totalMessages: 3 }, { author: 'bob', totalMessages: 1 }];
            const action = { type: actions.GET_MESSAGES_AUTHORS_RESPONSE, authors };
            const expectedState = { authors };

            expect(reducer(initialState, action)).toEqual(expectedState);
        });
    });

    describe('SELECT_AUTHOR', () => {
        it('should change selected author in the store and switch state to the messages', () => {
            const initialState = { selectedAuthor: null, state: actions.messageStates.users };
            const author = 'bob';
            const action = { type: actions.SELECT_AUTHOR, author };
            const expectedState = { selectedAuthor: author, state: actions.messageStates.messages };

            expect(reducer(initialState, action)).toEqual(expectedState);
        });
    });
});
