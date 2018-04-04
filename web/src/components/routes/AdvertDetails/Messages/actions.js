import { postAdvertMessage, getAdvertMessages, getAdvertMessagesAuthors, updateAdvertMessage } from 'api';
export const messageStates = {
    users: 'users',
    messages: 'messages',
};
export const SET_MESSAGES_STATE = 'SET_MESSAGES_STATE';
export const setMessagesState = state => ({ type: SET_MESSAGES_STATE, state });

export const SET_MESSAGE_TEXT = 'SET_MESSAGE_TEXT';
export const setMessageText = text => ({ type: SET_MESSAGE_TEXT, text });

export const POST_MESSAGE_REQUEST = 'POST_MESSAGE_REQUEST';
export const POST_MESSAGE_RESPONSE = 'POST_MESSAGE_RESPONSE';
export const postMessage = message => async dispatch => {
    dispatch({ type: POST_MESSAGE_REQUEST, });

    const response = await postAdvertMessage(message.advertId, message);

    dispatch({ type: POST_MESSAGE_RESPONSE, message: response.data });
};

export const GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST';
export const GET_MESSAGES_RESPONSE = 'GET_MESSAGES_RESPONSE';
export const getMessages = (advertId, username) => async dispatch => {
    dispatch({ type: GET_MESSAGES_REQUEST });

    const response = await getAdvertMessages(advertId, username);

    dispatch({ type: GET_MESSAGES_RESPONSE, messages: response.data });
};

export const GET_MESSAGES_AUTHORS_REQUEST = 'GET_MESSAGES_AUTHORS_REQUEST';
export const GET_MESSAGES_AUTHORS_RESPONSE = 'GET_MESSAGES_AUTHORS_RESPONSE';
export const getMessagesAuthors = advertId => async dispatch => {
    dispatch({ type: GET_MESSAGES_AUTHORS_REQUEST })

    const response = await getAdvertMessagesAuthors(advertId);

    dispatch({ type: GET_MESSAGES_AUTHORS_RESPONSE, authors: response.data })

};

export const SELECT_AUTHOR = 'SELECT_AUTHOR';
export const selectAuthor = author => ({ type: SELECT_AUTHOR, author });

export const MARK_MESSAGE_AS_READ_REQUEST = 'MARK_MESSAGE_AS_READ_REQUEST';
export const MARK_MESSAGE_AS_READ_RESPONSE = 'MARK_MESSAGE_AS_READ_RESPONSE';
export const markMessageAsRead = messageId => async dispatch => {
    dispatch({ type: MARK_MESSAGE_AS_READ_REQUEST });

    const response = await updateAdvertMessage(messageId, { isRead: true });

    dispatch({ type: MARK_MESSAGE_AS_READ_RESPONSE, message: response.data });
};
