import 'isomorphic-fetch';
import qs from 'qs';

const fetchStatusHandler = (response) => {
    if (response.status === 200) {
        return response;
    }

    throw new Error(response.statusText);
};

export default {
    post(url, body) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Data-Type', 'json');

        return fetch(`/api/${url}`, {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include',
            headers,
        })
        .then(fetchStatusHandler)
        .then(res => res.json())
        .catch(Promise.reject);
    },

    get(url, body = {}) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Data-Type', 'json');
        const query = qs.stringify(body);

        return fetch(`/api/${url}?${query}`, {
            method: 'GET',
            credentials: 'include',
            headers,
        })
        .then(fetchStatusHandler)
        .then(res => res.json())
        .catch(Promise.reject);
    },
};

