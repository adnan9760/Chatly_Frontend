const BASE_URL =process.env.REACT_APP_BASE_URL;
console.log("Bse",BASE_URL);

export const catagories ={
    SENDOTP_API:BASE_URL + "/auth/sendOtp" ,
    SINGUP_API:BASE_URL+"/auth/register",
    LOGIN_API:BASE_URL + "/auth/login",
    SEND_REQUEST:BASE_URL + "/auth/friendrequest",
    GET_REQUEST:BASE_URL + "/auth/getfriendrequest",
    ACCEPT_REQUEST:BASE_URL + "/auth/accpetfriendrequest",
    REJECT_REQUEST: BASE_URL + "/auth/rejectfriendrequest",
    GET_FRIEND:BASE_URL +"/auth/getfriend"
}