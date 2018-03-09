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
