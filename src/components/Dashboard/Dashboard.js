import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import {
  useMetrics,
  useMeasurements,
  useLatestMeasurements
} from '../hooks';
import { TimeSeries, TimeRange } from "pondjs";
// COMPONENTS
import Chart from './Chart';
import MyTable from './Table';
// MATERIAL-UI
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  card: {

  }
}));

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
    selectedMetrics: [''],
    measurementQuery: [],
    trafficSeries: null,
    axisData: null,
    showChart: false
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
    let trafficSeries = TimeSeries.timeSeriesListMerge({
      name: "metrics",
      seriesList: timeSeriesList
    })    
    setState(state => ({
      ...state,
      timeSeriesList: timeSeriesList,
      axisData: axisData,
      trafficSeries: trafficSeries
    }))
  }, [measurementsState])

  // for each metric selected get values from subscription
  useEffect(() => {
    if (subscription.latestMeasurements.newMeasurement !== undefined) {
      const newMeasureName = subscription.latestMeasurements.newMeasurement.metric
      const newMeasureVal = subscription.latestMeasurements.newMeasurement.value
      for (let i=0; i<state.selectedMetrics.length; i++) {
        if (newMeasureName === state.selectedMetrics[i]) {
          setSubscriptionState(prevState => ({
            ...prevState, 
            [state.selectedMetrics[i]]: newMeasureVal
          }))            
        }
      }
    }
  }, [subscription])

  // track selected metrics
  const handleChange = (e) => {
    console.log(e)
    let selectedMetrics = [];
    if (e !== null) {
      for (let i=0; i<e.length; i++) {
        selectedMetrics.push(e[i].value)
      }
      setState(state => ({
         ...state,
         showChart: true,
         selectedMetrics: selectedMetrics
      }))
    } else {
      setState(state => ({
        ...state,
        showChart: false,
        selectedMetrics: ['']
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
        {state.showChart !== false &&
          <React.Fragment>
            <Grid item xs={9}>
              <Chart timeSeriesList={state.timeSeriesList} axisData={state.axisData} trafficSeries={state.trafficSeries}/>
            </Grid>  
            {subscriptionState !== null &&
              <Grid xs={3} style={{padding: 20}}>
                <MyTable subscriptionState={subscriptionState}/>
              </Grid>
            }
          </React.Fragment>
        }      
      </Grid>
    </div>  
  )
}

  
export default Dashboard;