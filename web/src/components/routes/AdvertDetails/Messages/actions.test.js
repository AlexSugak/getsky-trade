import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from 'api';
import * as apiStubs from '__mocks__/api';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Messages actions', () => {
    describe('setMessagesState', () => {
        it('should create action with SET_MESSAGES_STATE type and specified state', () => {
            const expected = { type: actions.SET_MESSAGES_STATE, state: actions.messageStates.users };
            expect(actions.setMessagesState(actions.messageStates.users)).toEqual(expected);
        });
    });

    describe('setMessageText', () => {
        it('should create action with SET_MESSAGE_TEXT type and specified state', () => {
            const text = 'message text';
            const expected = { type: actions.SET_MESSAGE_TEXT, text };
            expect(actions.setMessageText(text)).toEqual(expected);
        });
    });

    describe('postMessage', () => {
        it('should call post message API and dispatch actions', () => {
            const messageStub = { id: 1, body: 'msg_body', author: 'bob' };
            const expectedActions = [
                { type: actions.POST_MESSAGE_REQUEST },
                { type: actions.POST_MESSAGE_RESPONSE, message: messageStub }
            ];

            api.postAdvertMessage = apiStubs.postAdvertMessageOk;
            const store = mockStore({});
            return store.dispatch(actions.postMessage(messageStub))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });

    describe('getMessages', () => {
        it('should call get messages API and dispatch actions', () => {
            const messagesStub = [{ id: 1, body: 'msg_body', author: 'bob' }, { id: 2, body: 'msg_body', author: 'sam' }]
            const expectedActions = [
                { type: actions.GET_MESSAGES_REQUEST },
                { type: actions.GET_MESSAGES_RESPONSE, messages: messagesStub }
            ];

            api.getAdvertMessages = apiStubs.getAdvertMessagesOk(messagesStub);
            const store = mockStore({});
            return store.dispatch(actions.getMessages(1, 'bob'))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });

    describe('getMessagesAuthors', () => {
        it('should call get messages authors API and dispatch actions', () => {
            const messagesAuthorsStub = [{ author: 'sam', totalMessages: 3 }, { author: 'bob', totalMessages: 1 }];;
            const expectedActions = [
                { type: actions.GET_MESSAGES_AUTHORS_REQUEST },
                { type: actions.GET_MESSAGES_AUTHORS_RESPONSE, authors: messagesAuthorsStub }
            ];

            api.getAdvertMessagesAuthors = apiStubs.getAdvertMessagesAuthorsOk(messagesAuthorsStub);

            const store = mockStore({});
            return store.dispatch(actions.getMessagesAuthors(1))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });

    describe('markMessageAsRead', () => {
        it('should call PUT message API and dispatch actions', () => {
            const messageStub = { id: 1, body: 'msg', isRead: true };
            const expectedActions = [
                { type: actions.MARK_MESSAGE_AS_READ_REQUEST },
                { type: actions.MARK_MESSAGE_AS_READ_RESPONSE, message: messageStub }
            ];

            api.updateAdvertMessage = apiStubs.updateAdvertMessageOk(messageStub);

            const store = mockStore({});
            return store.dispatch(actions.markMessageAsRead(1))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });

    describe('selectAuthor', () => {
        it('should create action with SELECT_AUTHOR type and specified author', () => {
            const author = 'bob';
            const expected = { type: actions.SELECT_AUTHOR, author };
            expect(actions.selectAuthor(author)).toEqual(expected);
        });
    });
});
