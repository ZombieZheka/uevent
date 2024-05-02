import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import paymentReducer from "../payment/app/paymentSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        payment: paymentReducer
    }
})

