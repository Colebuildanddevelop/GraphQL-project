import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'urql';
import { actions as metricActions} from '../Features/Metrics/reducer';
import { actions as measurementActions} from '../Features/Measurements/reducer';


const getMetricsQuery = `
  query getMetrics {
    getMetrics
  }
`
const getMultipleMeasurementsQuery = `
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
    if (!data) {
      return
    }
    const { getMetrics } = data
    dispatch(metricActions.metricsReceived({metrics: getMetrics}));
  }, [dispatch, data, error])  
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
          metricName: metric,
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
      return
    }
    const { getMultipleMeasurements } = data
    dispatch(measurementActions.measurementsReceived({measurements: getMultipleMeasurements}));
  }, [dispatch, data, error])  
  return null 
}