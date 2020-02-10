import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, useSubscription } from 'urql';
import gql from 'graphql-tag';
import { actions as metricActions} from '../../Features/Metrics/reducer';
import { actions as measurementActions} from '../../Features/Measurements/reducer';
import { actions as subscriptionActions} from '../../Features/Subscriptions/reducer';

const getMetricsQuery = gql`
  query getMetrics {
    getMetrics
  }
`
const getMultipleMeasurementsQuery = gql`
  query($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        at
        value
        unit
      }
    }
  }
`
const newMessages = `
  subscription newMeasurement {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;

export const useMetrics = () => {  
  const dispatch = useDispatch();
  const [metricResult] = useQuery({
    query: getMetricsQuery
  })  
  const { fetching, data, error } = metricResult;
  useEffect(() => {
    if (error) {
      dispatch(metricActions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (fetching) {
      return;
    }
    if (!data) {
      return
    }
    const { getMetrics } = data
    dispatch(metricActions.metricsReceived({metrics: getMetrics}));
  }, [dispatch, data, error, fetching])  
  return null
}

export const useMeasurements = (metrics) => {
  const dispatch = useDispatch();
  let thirtyMinutesAgo = new Date() - 30*60000;  
  const [measurementResult] = useQuery(
    {
      query: getMultipleMeasurementsQuery,
      variables: {
        input: metrics.map(metric => ({
          metricName: metric.value,
          after: thirtyMinutesAgo,
        }))
      }
    },
  ); 
  const { fetching, data, error } = measurementResult;
  useEffect(() => {
    if (error) {
      dispatch(measurementActions.measurementsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) {
      return;
    }
    const { getMultipleMeasurements } = data;
    dispatch(measurementActions.measurementsReceived({measurements: getMultipleMeasurements}));
  }, [dispatch, data, error, fetching])  
  return null;
}

export const useLatestMeasurements = () => {
  const dispatch = useDispatch();
  const [res] = useSubscription({ query: newMessages });  

  useEffect(() => {
    if (res.error) {
      let error = res.error;
      dispatch(subscriptionActions.latestMeasurementsApiErrorReceived({ error: error}))
    }
    if (!res.data) {
      return;
    }
    const data = res.data 
    dispatch(subscriptionActions.latestMeasurementsReceived({ latestMeasurements: data }))
  }, [res, dispatch])
  return null
}