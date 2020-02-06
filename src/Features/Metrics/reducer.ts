import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metrics = {
  metrics: string[];
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metrics: ['']
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsReceived: (state, action: PayloadAction<Metrics>) => {
      const { metrics } = action.payload; 
      state.metrics = metrics     
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
