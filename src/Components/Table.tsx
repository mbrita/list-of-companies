import { useEffect, useRef, useState } from "react"
import axios from "axios"
import classNames from "classnames"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import classes from "../Components/Table.module.scss"
import {
  addNewCompany,
  changeAll,
  changeColor,
  clearAll,
  deleteCompany,
  deleteCheckedCompany,
  updCompany,
  Company,
  pushCompanyToStart,
} from "../Features/Company/CompanySlice"

export const Table = () => {
  const dispatch = useDispatch()

  const [newCompanyName, setNewCompanyName] = useState<string>("")
  const [newCompanyAddress, setNewCompanyAddress] = useState<string>("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<"name" | "address" | null>(
    null
  )
  const [editedValue, setEditedValue] = useState<string>("")
  const [page, setPage] = useState<number>(1)

  const selectedRowIndex = useSelector(
    (state: RootState) => state.company.selectedRowIndex
  )
  const list = useSelector((state: RootState) => state.company.list)
  const companies = useSelector((state: RootState) => state.company.list)

  const tableHeaders = ["Название компании", "Адрес"]

  const handleEdit = (index: number, field: "name" | "address") => {
    setEditingIndex(index)
    setEditingField(field)
    setEditedValue(companies[index][field])
  }

  const saveEdit = (index: number) => {
    if (editingField) {
      dispatch(updCompany({ index, field: editingField, value: editedValue }))
    }
    setEditingIndex(null)
    setEditingField(null)
  }

  const observer = useRef<IntersectionObserver | null>(null)
  const lastElement = useRef<HTMLTableDataCellElement | null>(null)

  useEffect(() => {
    const getApiData = async () => {
      try {
        const response = await axios<Company>(
          `https://f16fb68ab95103ff.mokky.dev/listofcompanies?page=${page}&limit=20`
        )
        response.data.items.forEach((company) => {
          dispatch(addNewCompany(company))
        })
      } catch (error) {
        console.error("Ошибка при получении данных:", error)
      }
    }
    getApiData()
  }, [dispatch, page])

  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1)
      }
    }

    observer.current = new IntersectionObserver(callback)

    if (list.length === 0) return
    if (observer.current) observer.current.disconnect()
    if (lastElement.current) observer.current.observe(lastElement.current)

    return () => {
      observer.current?.disconnect()
    }
  }, [list])

  const handleCheckboxChange = (index: number) => {
    dispatch(changeColor(index))
  }

  const selectAllCheckbox = () => {
    if (selectedRowIndex.length === list.length) {
      dispatch(clearAll())
    } else {
      const allIndexes = list.map((_, index) => index)
      dispatch(changeAll(allIndexes))
    }
  }

  const pushNewCompany = () => {
    if (newCompanyName && newCompanyAddress) {
      dispatch(
        addNewCompany({ name: newCompanyName, address: newCompanyAddress })
      )
      setNewCompanyName("")
      setNewCompanyAddress("")
    } else {
      setNewCompanyName("Введите адрес")
    }
  }

  const pushToStart = () => {
    if (newCompanyName && newCompanyAddress) {
      dispatch(
        pushCompanyToStart({ name: newCompanyName, address: newCompanyAddress })
      )
      setNewCompanyName("")
      setNewCompanyAddress("")
    } else {
      setNewCompanyName("Введите адрес")
    }
  }

  const deleteCompanyByIndex = (index: number) => {
    dispatch(deleteCompany(index))
  }
  const deleteSomeCompany = () => {
    dispatch(deleteCheckedCompany(selectedRowIndex))
  }

  return (
    <table className={classes.tableWrapper}>
      <thead>
        <tr>
          <th>
            <input
              className={classes.headerCell}
              type="checkbox"
              onChange={selectAllCheckbox}
              checked={selectedRowIndex.length === list.length}
            />
          </th>
          {tableHeaders.map((header, i) => (
            <th key={i + 1} className={classes.headerCell}>
              {header}
            </th>
          ))}
          {selectedRowIndex.length > 1 ? (
            <th className={classes.btnImg}>
              <button
                onClick={deleteSomeCompany}
                disabled={selectedRowIndex.length === 0}
              >
                <img
                  src="https://img.icons8.com/?size=100&id=T9nkeADgD3z6&format=png&color=000000"
                  alt="Удалить"
                />
              </button>
            </th>
          ) : (
            <th></th>
          )}
        </tr>
        <tr className={classes.tableRowAdd}>
          <td></td>
          <td className={classes.cell}>
            <input
              className={classes.companyInput}
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              type="text"
              placeholder="Введите название компании"
            />
          </td>
          <td className={classes.cell}>
            <input
              className={classes.companyInput}
              value={newCompanyAddress}
              onChange={(e) => setNewCompanyAddress(e.target.value)}
              type="text"
              placeholder="Введите адрес"
            />
          </td>
          <td>
            <button onClick={pushToStart}>
              <img
                src="https://img.icons8.com/?size=100&id=17163&format=png&color=43BA2F"
                alt="Добавить"
              />
            </button>
          </td>
        </tr>
      </thead>

      <tbody>
        {list.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={classNames(
              classes.tableRow,
              selectedRowIndex.includes(rowIndex) && classes.highlight
            )}
          >
            <td>
              <input
                type="checkbox"
                checked={selectedRowIndex.includes(rowIndex)}
                onChange={() => handleCheckboxChange(rowIndex)}
                className={classes.btnImg}
              />
            </td>
            {editingIndex === rowIndex && editingField === "name" ? (
              <td>
                <input
                  className={classes.inputCell}
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(rowIndex)
                  }}
                />
              </td>
            ) : (
              <td
                className={classes.cell}
                onClick={() => handleEdit(rowIndex, "name")}
              >
                {row.name}
              </td>
            )}

            {editingIndex === rowIndex && editingField === "address" ? (
              <td className={classes.cell}>
                <input
                  className={classes.inputCell}
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  onBlur={() => saveEdit(rowIndex)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(rowIndex)
                  }}
                />
              </td>
            ) : (
              <td
                className={classes.cell}
                onClick={() => handleEdit(rowIndex, "address")}
              >
                {row.address}
              </td>
            )}
            <td>
              <button onClick={() => deleteCompanyByIndex(rowIndex)}>
                <img
                  src="https://img.icons8.com/?size=100&id=T9nkeADgD3z6&format=png&color=000000"
                  alt="Удалить"
                />
              </button>
            </td>
          </tr>
        ))}

        <td ref={lastElement} style={{ backgroundColor: "red", opacity: 0 }}>
          12312
        </td>
      </tbody>
    </table>
  )
}
