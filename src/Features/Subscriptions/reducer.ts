import { createSlice, PayloadAction } from 'redux-starter-kit';

export type LatestMeasurement = {
  latestMeasurements: object;
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  latestMeasurements: {}
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    latestMeasurementsReceived: (state, action: PayloadAction<LatestMeasurement>) => {
      const { latestMeasurements } = action.payload; 
      state.latestMeasurements = latestMeasurements;    
    },
    latestMeasurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
