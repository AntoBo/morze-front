import axios from "axios";

const baseBackendUrl = process.env.REACT_APP_BACKEND_URL;

export const setAxiosToken = (accessToken) => {
    axios.defaults.headers.common["authorization"] = "Bearer " + accessToken;
};

export const fetchLogin = async (data) => {
    const resp = await axios.post(baseBackendUrl + `/login`, data);
    return resp;
};

export const fetchGetAllUsers = async () => {
    const resp = await axios.get(baseBackendUrl + `/users`);
    return resp;
};

export const fetchBanUser = async (id) => {
    const resp = await axios.put(baseBackendUrl + `/users/${id}`);
    return resp;
};
export const fetchRemoveUser = async (id) => {
    const resp = await axios.delete(baseBackendUrl + `/users/${id}`);
    return resp;
};
