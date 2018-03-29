import { SET_FORM_PREVIEW } from './actions';

const initialState = {
    preview: undefined,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_FORM_PREVIEW:
            return { ...state, preview: action.preview };
        default:
            return state;
    }
};
