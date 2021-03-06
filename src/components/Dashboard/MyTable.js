import React from 'react';
// MATERIAL UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Zoom from '@material-ui/core/Zoom'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
});

const MyTable = (props) => {
  const classes = useStyles();
  
  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow key={'tableTitles'}>
          <TableCell key={'tableTitles1'} >Metric Name</TableCell>
          <TableCell key={'tableTitles2'} align="right">Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.selectedMetrics.map((metric) => {          
          return (
            <React.Fragment key={metric.value}>
              <Zoom in={true} timeout={750}>
                <TableRow key={`${metric.value}0`}>
                  <TableCell key={`${metric.value}1`} component="th" scope="row" style={{color: metric.color}}>
                    {metric.value}
                  </TableCell>   
                  <TableCell key={`${metric.value}2`} align="right">{props.subscriptionState[metric.value]}</TableCell>
                </TableRow>
              </Zoom>  
            </React.Fragment>
          )
        })}      
      </TableBody>
    </Table>
  );
}
export default MyTable;