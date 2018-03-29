import axios from 'axios';

const apiUrl = '/api';
const headers = {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
};

export const getSellAdverts = () =>
    axios.get(`${apiUrl}/postings/sell/latest`, headers);


export const getBuyAdverts = () =>
    axios.get(`${apiUrl}/postings/buy/latest`, headers);

export const getAllAdverts = () =>
    axios.all([getSellAdverts(), getBuyAdverts()])
        .then(axios.spread((sell, buy) => {
            return { sellAdverts: sell.data, buyAdverts: buy.data };
        }));

export const registerUser = user =>
    axios.post(`${apiUrl}/users`, JSON.stringify(user), headers);

export const login = user =>
    axios.post(`${apiUrl}/users/authenticate`, user, headers);

export const getUserInfo = () =>
    axios.get(`${apiUrl}/me`, headers);

export const getCountries = () =>
    axios.get(`${apiUrl}/countries`, headers);

export const getStates = () =>
    axios.get(`${apiUrl}/states`, headers);
export const getAdvertDetails = id =>
    axios.get(`${apiUrl}/postings/${id}`, headers);

export const getSkycoinPrice = currency =>
    axios.get(`${apiUrl}/skycoin-price/${currency}`);

export const updateUserSettings = settings =>
    axios.post(`${apiUrl}/me/settings`, settings, headers)

export const postBuyAdvert = advert =>
    axios.post(`${apiUrl}/postings/buy`, advert, headers);

export const postSellAdvert = advert =>
    axios.post(`${apiUrl}/postings/sell`, advert, headers)
