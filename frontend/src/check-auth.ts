import api from "./axiosApi";

export const checkAuth = async () => {
    let isLoggedIn = false;
    const res = await api.get('/profile');
    if (res.status == 200) isLoggedIn = true;

    return isLoggedIn;
};

export const authRequired = async () => {
    if (await checkAuth()) return;

    window.location.href = '/login';
}