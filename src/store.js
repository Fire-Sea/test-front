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
        login_toggle: false,
    },
    reducers: {
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

export let {changeLoginToggle} = token.actions;