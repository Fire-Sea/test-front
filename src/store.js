import { configureStore, createSlice } from "@reduxjs/toolkit";

let ip = createSlice({
    name: 'ip',
    initialState: 'firesea.o-r.kr:8080',
    // initialState: '172.30.1.29:8080'
    // initialState: '192.168.0.6:8080'
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
let menuStatus = createSlice({
    name: 'menuStatus',
    initialState: false,
    reducers: {
        changeMenuStatus(state, value){
            return state = value.payload;
        }
    }
})
export default configureStore({
    reducer: { 
        ip : ip.reducer,
        loginInfo : loginInfo.reducer,
        menuStatus : menuStatus.reducer,
    }
})

export let {changeLoginStatus, changeNickname} = loginInfo.actions;
export let {changeMenuStatus} = menuStatus.actions;