const AUTH_ACCESS_TOKEN = 'AUTH_ACCESS_TOKEN';

export const getAuthTokens = () => {
    const tokens = localStorage.getItem(AUTH_ACCESS_TOKEN);
    if (tokens !== null) {
        return JSON.parse(tokens);
    }

    return null;
};

export const putAuthTokens = tokens => {
    if (tokens !== null) {
        localStorage.setItem(AUTH_ACCESS_TOKEN, JSON.stringify(tokens));
    }
};

export const deleteAuthTokens = () => {
    localStorage.setItem(AUTH_ACCESS_TOKEN, null);
};
