import axios from 'axios';

const apiUrl = '/api';
const headers = new Headers({
    "Content-Type": "application/json",
    "Accept": "application/json",
});

export const getSellAdverts = () =>
    axios.get(`${apiUrl}/postings/sell/latest`, headers);


export const getBuyAdverts = () =>
    axios.get(`${apiUrl}/postings/buy/latest`, headers);

export const getAllAdverts = () =>
    axios.all([getSellAdverts(), getBuyAdverts()])
        .then(axios.spread((sell, buy) => {
            return { sellAdverts: sell.data, buyAdverts: buy.data };
        }));
