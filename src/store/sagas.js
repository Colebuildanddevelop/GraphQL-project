import { spawn } from 'redux-saga/effects';
import weatherSaga from '../Features/Weather/saga';
import metricSaga from '../Features/Metrics/saga';
import measurementSaga from '../Features/Measurements/saga';
import latestMeasurementsSaga from '../Features/Subscriptions/saga';

export default function* root() {
  yield spawn(weatherSaga);
  yield spawn(metricSaga);
  yield spawn(measurementSaga);
}
