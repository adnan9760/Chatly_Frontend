import { em } from "framer-motion/client";
import apiconnector from "../apiconnector";
import { catagories } from "../apis";
import { settoken } from "../../Reducer/slices/authSlice";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AwardIcon } from "lucide-react";

export function sendOtp(email, navigate) {
  console.log("email",email);
  return async (dispatch) => {
    try {
      const response = await apiconnector("POST", catagories.SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      console.log("otp", response.data);
      console.log("SENDOTP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verifyotp");
      return response.data;
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error("Could Not Send OTP");
    }
  };
}
export function Login({email,password,navigate}){
  console.log("emaillllllll",email);
  console.log("passwordddddd",password);
return async (dispatch)=>{
  try {
    const response = await apiconnector('POST',catagories.LOGIN_API,{
      email,
      password
    });
    console.log("responce login api",response.data);

    dispatch(settoken(response.data.token));

          localStorage.setItem("token", JSON.stringify(response.data.token));
          console.log("response.data.user.username",response.data.user.username)
          localStorage.setItem("username", response.data.user.username);
      return response.data;
  } catch (error) {
    {
      console.log("Login API ERROR............", error);
      toast.error("Something went Wrong");
    }
  }
}
}
export function Register({username,email,password,otpcode}){
  return async (dispatch)=>{
    console.log("usernameeeeee",username);
    console.log("enial",email)
    console.log("optcdoe",otpcode)
    try {
      const responce = await apiconnector('POST',catagories.SINGUP_API,{
        username,
        email,
        password,
        otpcode
      })
      console.log("Register loign api ",responce.data);

      toast.success("Registered Successfully");
      return responce.data;
    } catch (error) {
      {
      console.log("Register API ERROR............", error);
      toast.error("Something Worng went");
    }
    }
  }
}
export function AcceptFriendRequest(id){

  console.log("iddddddddddddd",id);
  return async(dispatch)=>{
    try {
      const responce = await apiconnector("POST",catagories.ACCEPT_REQUEST,{
        id
      },
    {
        "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    })
    console.log("Acceprt",responce.data);
    } catch (error) {
       console.log("SEND API ERROR............", error);
      toast.error("Something Worng went");
    }
  }
}
export function getfriend(){
  return async(dispatch)=>{
    try {
      const responce = await apiconnector("GET",catagories.GET_FRIEND,{},
        {
      "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }


      )
        console.log("friend Request",responce.data);

        return responce.data;
    } catch (error) {
       console.log("SEND API ERROR............", error);
      toast.error("Something Worng went");
    }
  }
}
export function getfriendrequest(){
  return async(dispatch)=>{
    try {
      const responce = await apiconnector("GET",catagories.GET_REQUEST,{},
        {
      "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }


      )
        console.log("friend Request",responce.data);

        return responce.data;
    } catch (error) {
       console.log("SEND API ERROR............", error);
      toast.error("Something Worng went");
    }
  }
}


export function sendfriendrequest(friendEmail){
  console.log("emailllllllllllll",friendEmail);
  return async(dispatch)=>{
    try {
    const response = await apiconnector(
  "POST",
  catagories.SEND_REQUEST,
  { email: friendEmail },
  {
      "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }
);


      console.log("responce of send request",response);
      
      toast.success("FriendRequest send  Successfully");
      return response.data;

    } catch (error) {
       console.log("SEND API ERROR............", error);
      toast.error("Something Worng went");
    }
  }
}