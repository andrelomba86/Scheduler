import { configureStore } from '@reduxjs/toolkit';
import participantsReducer from './participantsSlice';
// import participantReducer from './redux/participantsSlice'

export default configureStore({
  reducer: {
    participants: participantsReducer,
  },
});
