import { configureStore, createSlice } from "@reduxjs/toolkit";

let ip = createSlice({
    name: 'ip',
    initialState: '172.30.1.33:8080',
    // '172.30.1.31:8080'
    // firesea.o-r.kr:8080
})
let token = createSlice({
    name: 'token',
    initialState: {
        access_token: '',
        refresh_token: ''
    },
    reducers: {
        changeAccessToken(state, token){
            console.log('token = '+token.payload);
            state.access_token = token.payload;
        },
        changeToken(state, t){
            state = JSON.parse(JSON.stringify(t.payload));
        }
    }
})


export default configureStore({
    reducer: { 
        ip : ip.reducer,
        token : token.reducer
    }
})

export let {changeAccessToken, changeToken} = token.actions;