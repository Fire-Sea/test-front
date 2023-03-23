import { configureStore, createSlice } from "@reduxjs/toolkit";

let ip = createSlice({
    name: 'ip',
    initialState: 'firesea.o-r.kr:8080',
    // '172.30.1.31:8080'
    // firesea.o-r.kr:8080
})
let token = createSlice({
    name: 'token',
    initialState: {
        login_status: false,
        login_toggle: false,
        access_token: '',
        refresh_token: ''
    },
    reducers: {
        changeAccessToken(state, token){
            state.access_token = token.payload.access_token;
        },
        changeBothToken(state, token){
            [state.access_token, state.refresh_token] = [token.payload.access_token, token.payload.refresh_token];
        },
        changeLoginStatus(state, bool){
            state.login_status = bool.payload;
        },
        changeLoginToggle(state, bool){
            state.login_toggle = bool.payload;
        }
    }
})

export default configureStore({
    reducer: { 
        ip : ip.reducer,
        token : token.reducer
    }
})

export let {changeAccessToken, changeBothToken, changeLoginStatus, changeLoginToggle} = token.actions;