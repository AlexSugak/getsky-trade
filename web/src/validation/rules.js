const id = v => v;

const validateValueExtractor = valueExtractor => {
    if (typeof (valueExtractor) !== 'function') {
        throw Error('valueExtractor is not valid. It must be a function.');
    }
}

export const required = (valueExtractor = id) =>
    value => {
        validateValueExtractor(valueExtractor);

        if (valueExtractor) {
            const extractedValue = value ? valueExtractor(value) : undefined;
            return extractedValue ? undefined : 'This field is required';
        }

        return value ? undefined : 'This field is required';
    }

export const min = (min, valueExtractor = id) =>
    value => {
        validateValueExtractor(valueExtractor);

        if (valueExtractor) {
            const extractedValue = valueExtractor(value);
            return extractedValue && extractedValue < min ? `This field must be ${min} or more` : undefined;
        }

        return value && value < min ? `This field must be ${min} or more` : undefined;
    };

export const minLength = (min, valueExtractor = id) =>
    value => {
        validateValueExtractor(valueExtractor);

        if (valueExtractor) {
            const extractedValue = valueExtractor(value);
            return extractedValue && extractedValue.length < min ? `This field must be ${min} characters or more` : undefined;
        }

        return value && value.length < min ? `This field must be ${min} characters or more` : undefined;
    };

export const maxLength = (max, valueExtractor = id) =>
    value => {
        validateValueExtractor(valueExtractor);

        if (valueExtractor) {
            const extractedValue = valueExtractor(value);
            return extractedValue && extractedValue.length > max ? `This field must be ${max} characters or less` : undefined;
        }

        return value && value.length > max ? `This field must be ${max} characters or less` : undefined;
    };

export const max = (max, valueExtractor = id) =>
    value => {
        validateValueExtractor(valueExtractor);

        if (valueExtractor) {
            const extractedValue = valueExtractor(value);
            return extractedValue && extractedValue > max ? `This field must be ${max} or less` : undefined;
        }

        return value && value > max ? `This field must be ${max} or less` : undefined;
    };

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

    if (value.to === undefined) {
        return value.from ? undefined : 'The field is required';
    } else {
        return (value.from && value.to) ? undefined : 'The field is required';
    }
};

export const ranged = value =>
    (value.to === undefined || (value.to >= value.from)) ? undefined : 'First value has to be bigger or same';


export const rangedMin = min => value =>
    (value.to === undefined && (value.from < min || value.to < min)) ? `The value can't be less than ${min}` : undefined;

export const rangedMax = max => value =>
    (value.to === undefined && (value.from > max || value.to > max)) ? `The value can't be more than ${max}` : undefined;
