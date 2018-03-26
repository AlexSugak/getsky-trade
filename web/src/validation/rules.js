export const required = value => (value ? undefined : 'This field is required');

export const minLength = min => value =>
    value && value.length < min ? `This field must be ${min} characters or more` : undefined;

export const maxLength = max => value =>
    value && value.length > max ? `This field must be ${max} characters or less` : undefined;

export const alphaNumeric = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? 'This field must contain only letters and numbers'
        : undefined;

export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? 'Invalid email address'
        : undefined;

export const rangedRequired = value => {
    if (value === '' || value === undefined) {
        return 'The field is required';
    }

    return (value.from && value.to) ? undefined : 'The field is required';
};

export const ranged = (min, max) => value =>
    (value.to >= value.from) ? undefined : 'First value has to be bigger or same';

export const rangedMin = min => value =>
    (value.from < min || value.to < min) ? `The value can't be less than ${min}` : undefined;

export const rangedMax = max => value =>
    (value.from > max || value.to > max) ? `The value can't be more than ${max}` : undefined;
