import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import { useQuery } from 'urql';

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
        metric
        unit
      }
    }
  }
`

const Dashboard = () => {
  const [state, setState] = useState({
    metrics: [],
    selectedMetrics: [],
    measurementQuery: []
  })
  
  const [metricResult] = useQuery({
    query: getMetricsQuery
  })

  let thirtyMinutesAgo = new Date() - 30*60000;  
  const [measurementResult] = useQuery(
    {
      query: getMultipleMeasurementsQuery,
      variables: {
        input: state.selectedMetrics.map(metric => ({
          metricName: metric.value,
          after: thirtyMinutesAgo
        }))
      }
    },
  );  

  useEffect(() => {
    if (metricResult.data !== undefined) {
      let metrics = []  
      for (let i=0; i<metricResult.data.getMetrics.length; i++) {
        metrics.push({
          value: metricResult.data.getMetrics[i],
          label: metricResult.data.getMetrics[i],
        })
      }
      setState(state => ({
        ...state,
        metrics: metrics
      }))
    }
  }, [metricResult])

  
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
      <button onClick={() => console.log(measurementResult)}>state</button>  
      <Select
        isMulti
        name="colors"
        options={state.metrics}
        onChange={handleChange}
      />
    </div>  
  )
}

export default Dashboard;