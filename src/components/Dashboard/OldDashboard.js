/***
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

const getMetrics = gql`
  query getMetrics {
    getMetrics
  }
`
const getMultipleMeasurements = gql`
  query($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        at
        value
        metric
        unit
      }
    }
  }
`

const Metrics = (props) => {
  return (
    <Query query={getMetrics}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        console.log(data)
        return (
          <Select
            isMulti
            name="colors"
            onChange={props.handleChange}
            options={data.getMetrics.map((metric) => ({value: metric, label: metric}))}
          />         
        )       
      }}
    </Query>
  )
}
     
const Measurements = (props) => {
  let thirtyMinutesAgo = new Date() - 30*60000;  
  return (
    <Query
      query={getMultipleMeasurements}
      variables={{
        input: props.selectedMetrics.map(metric => ({
          metricName: metric.value,
          after: thirtyMinutesAgo
        }))
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        return (
          <p>{data.map(d => return )}</p>
        )
         
        
      }}      
    </Query>
  )
}

const Dashboard = () => {
  const [state, setState] = useState({
    metrics: [],
    selectedMetrics: [{value: 'waterTemp'}],
    measurementQuery: []
  })
  /***
  useEffect(() => {
    if (metrics.getMetrics !== undefined) {
      let options = []  
      for (let i=0; i<metrics.getMetrics.length; i++) {
        options.push({
          value: metrics.getMetrics[i],
          label: metrics.getMetrics[i],
        })
      }
      setState(state => ({
        ...state,
        metrics: options
      }))        
    }
  }, [metrics])

  // fetch graph data for selected metric(s)
  const handleChange = (e) => {
    console.log(e) 
    setState(state => ({
       ...state,
       selectedMetrics: e
    }))
  }

  return (
    <div>
      <button onClick={() => console.log()}>state</button>  
      <Metrics onChange={handleChange}/>    
      <Measurements selectedMetrics={state.selectedMetrics}/>
    </div>  
  )
}

export default Dashboard;
  ***/
