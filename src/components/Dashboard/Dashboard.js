import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useQuery } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { useMetrics } from '../hooks';
import { useMeasurements } from '../hooks';
import { TimeSeries, TimeRange } from "pondjs";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  Resizable,
  styler
} from "react-timeseries-charts";
// MATERIAL-UI
import Grid from '@material-ui/core/Grid';

/*
 * @param {*} props 
 *  - series1
 */
const Chart = (props) => {
  const [state, setState] = useState({
    tracker: null,
    trackerInfo: []
  })
  const colors = [
    'red',
    'blue',
    'green',
    'purple',
    'brown',
    'yellow',    
  ]
  const range = new TimeRange(new Date() - 30*60000, new Date().getTime())
  const onTrackerChanged = t => {
    setState(state => ({
      ...state,
      tracker: t
    }))
    if (!t) {
      setState(state => ({
        ...state,
        trackerInfo: []
      }))      
    } else {
      setState(state => ({
        ...state,
        trackerInfo: props.timeSeriesList.map((series) => {
          const i = series.bisect(new Date(t))
          console.log(i)
          if (i !== undefined) {
            return {
              label: series.name(),
              value: series.at(i).get('value').toString()
            }
          } else {
            return {
              label: series.name(),
            } 
          }

        })  
      }))      
    }
  }

  if (props.timeSeriesList !== undefined) {
    return (
      <Resizable>
        <ChartContainer
          timeRange={range} 
          onTrackerChanged={onTrackerChanged}
          trackerPosition={state.tracker}
        >
          <ChartRow 
            height={500}
            trackerShowTime={true}
            trackerInfoValues={state.trackerInfo}
            trackerInfoHeight={10 + state.trackerInfo.length * 16}
            trackerInfoWidth={140}            
          >
            {props.axisData.map((data, i) =>                         
              <YAxis 
                key={i}
                id={`${i}`}
                label={data.id}
                min={data.min} 
                max={data.max} 
                width="60" 
                type="linear" 
              />
            )}                                      
            <Charts>
              {props.timeSeriesList.map((series, i) => {
                const style = styler(
                  props.timeSeriesList.map(s => ({
                    key: "value",
                    color: colors[i]
                  }))
                )
                return (
                  <LineChart
                    key={i}
                    axis={`${i}`} 
                    series={series} 
                    style={style}
                    column={["value"]}

                  />
                )
              })}
            </Charts>
          </ChartRow>
        </ChartContainer>
      </Resizable>
    )
  } else {
    return <p>select a metric</p>
  }

}

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

const Dashboard = () => {
  const [state, setState] = useState({
    metricOptions: [],
    selectedMetrics: [''],
    measurementQuery: [],
    trafficSeries: null,
    axisData: null,
    showChart: false
  })
  useMetrics();
  useMeasurements(state.selectedMetrics)
  const metricState = useSelector(retrieveMetrics)
  const measurementsState = useSelector(retrieveMeasurements)
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
  }, [metricState])

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
        <Grid item xs={6} style={{marginBottom: 20, marginLeft: '50%', marginRight: 20}}>
          <Select
            isMulti
            name="colors"
            options={state.metricOptions}
            onChange={handleChange}
          />
        </Grid>
        {state.showChart !== false &&
          <Grid item xs={12} style={{marginRight: 20}}>
            <Chart timeSeriesList={state.timeSeriesList} axisData={state.axisData} trafficSeries={state.trafficSeries}/>
          </Grid>  
        }      
      </Grid>
    </div>  
  )
}

  
export default Dashboard;