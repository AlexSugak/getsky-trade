import { SET_FORM_PREVIEW } from './actions'
import reduce, { initialState } from './reducers';

describe('postings preview reducers', () => {
    describe('SET_FORM_PREVIEW', () => {
        it('should set form preview', () => {
            const stubFormPreview = { id: 1, testField: 'A field', anotherField: 'another field' };
            const state = reduce(initialState, { type: SET_FORM_PREVIEW, preview: stubFormPreview });
            expect(state).toEqual({ ...initialState, preview: stubFormPreview });
        });
    });
});
