import { configureStore, createSlice } from "@reduxjs/toolkit";

let ip = createSlice({
    name: 'ip',
    initialState: 'firesea.o-r.kr:8080',
    // '172.30.1.31:8080'
})

export default configureStore({
    reducer: { 
        ip : ip.reducer
    }
})