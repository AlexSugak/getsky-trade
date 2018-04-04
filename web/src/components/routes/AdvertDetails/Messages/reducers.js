import {
    messageStates,

    SET_MESSAGES_STATE,
    SET_MESSAGE_TEXT,
    POST_MESSAGE_RESPONSE,
    GET_MESSAGES_RESPONSE,
    GET_MESSAGES_AUTHORS_RESPONSE,
    SELECT_AUTHOR,
} from './actions';

const initialState = {
    state: null,
    messages: [],

    authors: [],
    selectedAuthor: null,

    messageText: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_MESSAGE_TEXT:
            return { ...state, messageText: action.text };
        case SET_MESSAGES_STATE:
            return { ...state, state: action.state };
        case POST_MESSAGE_RESPONSE:
            return { ...state, messages: [...state.messages, action.message], messageText: '', };
        case GET_MESSAGES_RESPONSE:
            return { ...state, messages: action.messages };
        case GET_MESSAGES_AUTHORS_RESPONSE:
            return { ...state, authors: action.authors };
        case SELECT_AUTHOR:
            return { ...state, selectedAuthor: action.author, state: messageStates.messages };
        default: return state;
    }
}
