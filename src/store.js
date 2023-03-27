import { configureStore, createSlice } from "@reduxjs/toolkit";

let ip = createSlice({
    name: 'ip',
    initialState: 'firesea.o-r.kr:8080',
    // '172.30.1.31:8080'
    // firesea.o-r.kr:8080
})
let loginInfo = createSlice({
    name: 'loginInfo',
    initialState: {
        login_status: false,
        nickname: '',
    },
    reducers: {
        changeLoginStatus(state, bool){
            state.login_status = bool.payload;
        },
        changeNickname(state, nickname){
            state.nickname = nickname.payload;
        }
    }
})
export default configureStore({
    reducer: { 
        ip : ip.reducer,
        loginInfo : loginInfo.reducer,
    }
})

export let {changeLoginStatus, changeNickname} = loginInfo.actions;