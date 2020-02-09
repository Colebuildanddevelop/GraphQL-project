import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import {
  useMetrics,
  useMeasurements,
  useLatestMeasurements
} from './hooks';
import { TimeSeries } from "pondjs";
// COMPONENTS
import Chart from './Chart';
import MyTable from './MyTable';
// MATERIAL-UI
import Grid from '@material-ui/core/Grid';

const colors = [
  'red',
  'blue',
  'green',
  'purple',
  'brown',
  'yellow',    
]  

const retrieveMetrics = (state) => {
  const { metrics } = state.metrics
  return {
    metrics
  }
} 
const retrieveMeasurements = (state) => {
  const { measurements } = state.measurements
  return {
    measurements
  }
} 

const retrieveLatestMeasurements = (state) => {
  const { latestMeasurements } = state.latestMeasurements
  return {
    latestMeasurements
  }
}

const Dashboard = () => {
  const [state, setState] = useState({
    metricOptions: [],
    selectedMetrics: [],
    axisData: null,
  })
  const [subscriptionState, setSubscriptionState] = useState(null)
  // hooks to dispatch
  useMetrics();
  useMeasurements(state.selectedMetrics)
  useLatestMeasurements()
  // selectors to retrieve redux state 
  const metricState = useSelector(retrieveMetrics)
  const measurementsState = useSelector(retrieveMeasurements)
  const subscription = useSelector(retrieveLatestMeasurements)
  // format select options Obj
  useEffect(() => { 
    let metricOptions = []
    metricState.metrics.map((metric) => {
      metricOptions.push({
        label: metric,
        value: metric
      })
    })    
    setState(state => ({
      ...state,
      metricOptions: metricOptions
    }))
  }, [metricState])

  // format data to timeseries
  useEffect(() => {
    let formattedData = []
    let axisData = []
    // for each measurement
    measurementsState.measurements.map((measurement) => {
      if (measurement.measurements !== undefined) {
        // push series data
        let values = []
        let points = []
        measurement.measurements.map((obj) => {
          points.push([obj.at, obj.value])
          values.push(obj.value)
        })
        formattedData.push({
          name: measurement.metric,
          columns: ["time", "value"],
          points: points
        })
        let min = 0;
        let max = 1000
        if (values.length > 0) {
          min = Math.min(...values)
          max = Math.max(...values)   
        }

        axisData.push({
          id: measurement.metric,
          min: min,
          max: max         
        })
      }
    })    
    let timeSeriesList = formattedData.map((data) => {

      return new TimeSeries(data)
    })
    setState(state => ({
      ...state,
      timeSeriesList: timeSeriesList,
      axisData: axisData,
    }))
  }, [measurementsState])

  // for each metric selected get values from subscription
  useEffect(() => {
    if (subscription.latestMeasurements.newMeasurement !== undefined) {
      const newMeasureName = subscription.latestMeasurements.newMeasurement.metric
      const newMeasureVal = subscription.latestMeasurements.newMeasurement.value
      for (let i=0; i<state.selectedMetrics.length; i++) {
        if (newMeasureName === state.selectedMetrics[i].value) {
          setSubscriptionState(prevState => ({
            ...prevState, 
            [state.selectedMetrics[i].value]: newMeasureVal
          }))            
        }
      }
    }
  }, [subscription])

  // track selected metrics
  const handleChange = (e) => {
    let selectedMetrics = [];
    if (e !== null) {
      for (let i=0; i<e.length; i++) {
        selectedMetrics.push({
          value: e[i].value,
          color: colors[i]
        })
      }
      setState(state => ({
         ...state,
         selectedMetrics: selectedMetrics
      }))
    } else {
      setState(state => ({
        ...state,
        selectedMetrics: []
     }))
    }
  }
  return (
    <div>
      <Grid container style={{marginTop: 50}}>
        <Grid item xs={6} style={{marginBottom: 20, marginRight: '50%', marginLeft: 20}}>
          <Select
            isMulti
            name="colors"
            options={state.metricOptions}
            onChange={handleChange}
          />
        </Grid>
        {state.selectedMetrics.length !== 0 &&
          <React.Fragment>
            <Grid item xs={9}>
              <Chart timeSeriesList={state.timeSeriesList} axisData={state.axisData} selectedMetrics={state.selectedMetrics}/>
            </Grid>  
            {subscriptionState !== null &&
              <Grid item xs={3} style={{padding: 20}}>
                <MyTable subscriptionState={subscriptionState} selectedMetrics={state.selectedMetrics}/>
              </Grid>
            }
          </React.Fragment>
        }      
      </Grid>
    </div>  
  )
}

  
export default Dashboard;