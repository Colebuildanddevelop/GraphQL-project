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
  Resizable
} from "react-timeseries-charts";


/*
 * @param {*} props 
 *  - series1
 */
const Chart = (props) => {
  const range = new TimeRange(new Date() - 30*60000, new Date().getTime())
  console.log(props.timeSeriesList)
  if (props.timeSeriesList !== undefined) {
    return (
      <Resizable>
        <ChartContainer
          timeRange={range} 
          
        >
          <ChartRow height="200">
            {props.axisData.map((data, i) =>                         
              <YAxis 
                id={`${i}`}
                label={data.label}
                min={data.min} 
                max={data.max} 
                width="60" 
                type="linear" 
                format="$,.2f"
              />
            )}              
                        
            <Charts>
              {props.timeSeriesList.map((series, i) => {
                console.log(i)
                return <LineChart axis={`${i}`} series={series} />
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
    axisData: null
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
    setState(state => ({
      ...state,
      timeSeriesList: timeSeriesList,
      axisData: axisData
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
      console.log(selectedMetrics)
      setState(state => ({
         ...state,
         selectedMetrics: selectedMetrics
      }))
    } else {
      setState(state => ({
        ...state,
        selectedMetrics: ['']
     }))
    }
  }
  return (
    <div>
      <button onClick={() => console.log(state)}>state</button>  
      <Select
        isMulti
        name="colors"
        options={state.metricOptions}
        onChange={handleChange}
      />
      {(state.timeSeriesList !== null && state.axisData !== null) &&
        <Chart timeSeriesList={state.timeSeriesList} axisData={state.axisData}/>
      }
    </div>  
  )
}

  
export default Dashboard;