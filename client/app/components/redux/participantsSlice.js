import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { SHOW_NAMES_AND_DATES_AND_CALENDAR } from '../../Consts'

axios.defaults.baseURL = 'http://localhost:5000'

export const slice = createSlice({
  name: 'participants',
  initialState: {
    isLoading: false,
    currentId: '',
    editDateIndex: -1,
    dbCollection: [],
    showForm: SHOW_NAMES_AND_DATES_AND_CALENDAR,
  },
  reducers: {
    setCurrentId: (state, action) => {
      state.currentId = action.payload
    },
    setDBCollection: (state, action) => {
      // const { collection , currentId } = action.payload;
      const { collection, currentId } = action.payload
      if (currentId === '' && collection[0] !== undefined) state.currentId = collection[0]._id
      else state.currentId = currentId

      state.dbCollection = collection
      state.isLoading = false
      state.showForm = SHOW_NAMES_AND_DATES_AND_CALENDAR
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload
      console.log('setIsLoading()', state.isLoading)
    },
    setShowForm(state, action) {
      console.log('setShowForm()', action.payload)
      state.showForm = action.payload
    },
    setEditDateIndex(state, action) {
      state.editDateIndex = action.payload
    },
  },
})

export function updateDBCollection(currentId = '') {
  return async dispatch => {
    try {
      dispatch(setIsLoading(true))
      console.log('updateDBCollection() - after dispatch')
      const response = await axios.get('/get')
      console.log('updateDBCollection() - after axios.get()')
      if (response.data.error) throw Error(response.data.error.message)
      console.log('updconsole.log("updateDBCollection() - after response.data.error')
      dispatch(setDBCollection({ collection: response.data.collection, currentId: currentId }))
      // if (response.data.collection.length > 0) dispatch(setDBCollection({ collection: response.data.collection, currentId: currentId}))
      // if (response.data.collection.length > 0) dispatch(setDBCollection({ collection: response.data.collection }))
    } catch (err) {
      console.log('participantsSlice.updateDBCollection()', err)
    }
  }
}

export function submitAddNewParticipant(name) {
  return async dispatch => {
    try {
      dispatch(setIsLoading(true))
      const response = await axios.post('/add', { name: name })
      if (response.data.result) dispatch(updateDBCollection(response.data.doc._id))
      else throw Error(response.data.error)
    } catch (err) {
      dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))
      dispatch(setIsLoading(false))
    }
  }
}

export function submitRemoveParticipant(id) {
  return async dispatch => {
    try {
      dispatch(setIsLoading(true))
      const response = await axios.post('/del', { id: id })
      if (response.data.result) dispatch(updateDBCollection())
      else throw Error(response.data.error)
    } catch (err) {
      dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))
      dispatch(setIsLoading(false))
    }
  }
}
export function submitUpdate(id, data) {
  return async dispatch => {
    // var datesCopy = Array.from(dates)
    // datesCopy.splice(index, 1)

    try {
      dispatch(setIsLoading(true))
      const response = await axios.post('/update', { id: id, values: data })
      console.log('submitUpdate result', response.data.result)
      if (response.data.result) dispatch(updateDBCollection(id))
      else throw Error(response.data.error.message)
    } catch (err) {
      console.log('ERRO', err)
      dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))
      dispatch(setIsLoading(false))
    }
  }
}

export const { setCurrentId, setDBCollection, dbCollection, setIsLoading, setShowForm, setEditDateIndex } =
  slice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const getCurrentId = state => state.participants.currentId
export const getIsLoading = state => state.participants.isLoading
export const getDBCollection = state => state.participants.dbCollection
export const getParticipantsState = state => state.participants

export default slice.reducer
