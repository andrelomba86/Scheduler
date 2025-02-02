import { configureStore } from '@reduxjs/toolkit'
import participantsReducer from './participantsSlice'
// import participantReducer from './redux/participantsSlice'

const store = configureStore({
  reducer: {
    participants: participantsReducer,
  },
})
export default store
