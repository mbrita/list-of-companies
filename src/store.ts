import { configureStore } from "@reduxjs/toolkit"
import companyReducer from "./Features/Company/CompanySlice"

export const store = configureStore({
  reducer: {
    company: companyReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
