import { configureStore, createSlice } from "@reduxjs/toolkit";

let ip = createSlice({
    name: 'ip',
    initialState: 'firesea.o-r.kr:8080',
    // initialState: '172.30.1.42:8080'
    // initialState: '192.168.0.3:8080'
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
let searchData = createSlice({
    name: 'searchData',
    initialState: {
        option: 'textMessage',
        content: '',
        flag: false
    },
    reducers: {
        changeSearchOption(state, option){
            state.option = option.payload;
        },
        changeSearchContent(state, content){
            state.content = content.payload;
        },
        changeSearchFlag(state, flag){
            state.flag = flag.payload;
        }
    }
})
export default configureStore({
    reducer: { 
        ip : ip.reducer,
        loginInfo : loginInfo.reducer,
        menuStatus : menuStatus.reducer,
        searchData : searchData.reducer,
    }
})

export let {changeLoginStatus, changeNickname} = loginInfo.actions;
export let {changeMenuStatus} = menuStatus.actions;
export let {changeSearchOption, changeSearchContent, changeSearchFlag} = searchData.actions;