export const getAllAdverts = () => new Promise((resolve, reject) => {
    resolve({ sellAdverts: [], buyAdverts: [] });
});

export const loginOk = () => new Promise((resolve, reject) => {
    resolve({});
});

export const login401 = () => new Promise((resolve, reject) => {
    reject({ response: { status: 401 } });
});

export const registerUserOk = () => new Promise((resolve, reject) => {
    resolve({});
});

export const registerUser400 = () => new Promise((resolve, reject) => {
    reject({ 
        response: { status: 400, data: { '0': { key: 'stubField', message: 'stubMessage' } } }
    })
});
