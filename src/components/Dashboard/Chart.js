import React, { useState } from 'react';
import { TimeRange } from "pondjs";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  Resizable,
  styler
} from "react-timeseries-charts";

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
                min={data.min-20} 
                max={data.max+20} 
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

export default Chart;