import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useQuery } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { useMetrics } from '../hooks';
import { useMeasurements } from '../hooks';

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
    measurementQuery: []
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
      <button onClick={() => console.log(measurementsState)}>state</button>  
      <Select
        isMulti
        name="colors"
        options={state.metricOptions}
        onChange={handleChange}
      />
    </div>  
  )
}
  
export default Dashboard;