import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface CompanyItem {
  id: number
  name: string
  address: string
}

export interface Company {
  items: CompanyItem[]
}

export interface CompanyState {
  selectedRowIndex: number[]
  list: CompanyItem[]
}

interface UpdateCompanyPayload {
  index: number
  field: "name" | "address"
  value: string
}
const initialState: CompanyState = {
  selectedRowIndex: [],
  list: [],
}

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    changeColor: (state, action: PayloadAction<number>) => {
      const index = action.payload
      if (state.selectedRowIndex.includes(index)) {
        state.selectedRowIndex = state.selectedRowIndex.filter(
          (i) => i !== index
        )
      } else {
        state.selectedRowIndex.push(index)
      }
    },
    changeAll: (state, action: PayloadAction<number[]>) => {
      state.selectedRowIndex = action.payload
    },
    clearAll: (state) => {
      state.selectedRowIndex = []
    },
    deleteChecked: (state) => {
      state.selectedRowIndex = []
    },
    addNewCompany: (state, action) => {
      const existingCompany = state.list.find(
        (company) =>
          company.name === action.payload.name &&
          company.address === action.payload.address
      )

      if (!existingCompany) {
        state.list.push(action.payload)
      }
    },
    pushCompanyToStart: (state, action) => {
      const existingCompany = state.list.find(
        (company) =>
          company.name === action.payload.name &&
          company.address === action.payload.address
      )
      if (!existingCompany) {
        state.list.unshift(action.payload)
      }
    },
    deleteCompany: (state, action) => {
      state.list.splice(action.payload, 1)
    },
    deleteCheckedCompany: (state, action) => {
      const indexesToRemove = action.payload
      state.selectedRowIndex = state.selectedRowIndex.filter(
        (index) => !indexesToRemove.includes(index)
      )
      state.list = state.list.filter(
        (_, index) => !indexesToRemove.includes(index)
      )
    },
    updCompany: (state, action: PayloadAction<UpdateCompanyPayload>) => {
      const { index, field, value } = action.payload
      state.list[index][field] = value
    },
  },
})

export const {
  changeColor,
  changeAll,
  clearAll,
  addNewCompany,
  pushCompanyToStart,
  deleteCompany,
  deleteCheckedCompany,
  updCompany,
} = companySlice.actions

export default companySlice.reducer
