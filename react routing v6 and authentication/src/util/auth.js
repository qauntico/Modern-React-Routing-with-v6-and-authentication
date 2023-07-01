import { redirect } from "react-router-dom";
export function getAuthToken() {
    const token = localStorage.getItem('token');
    return token;
};

export function showToken() {
    return getAuthToken()
};

export function authTokenLoader() {
    const token = getAuthToken();
    if(!token){
       return redirect('/auth');
    }
    return null
};