import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    signupdata :null,
    logindata : null,
    token: localStorage.getItem("token")?JSON.parse(localStorage.getItem('token')):null,
    loading:false,
}

const authSlice = createSlice({
    name:'auth',
    initialState:initialState,
    reducers:{
          setSignupData: (state,value) =>{
            state.signupdata = value.payload;
        },
        setloading:(state,value)=>{
            state.loading= value.payload;
        },
        setlogindata:(state,value)=>{
            state.loading= value.payload;
        },
        settoken:(state,value)=>{
             state.token= value.payload;
        }
    }
})

export const { setSignupData, setloading, settoken , setlogindata } = authSlice.actions;

export default authSlice.reducer;