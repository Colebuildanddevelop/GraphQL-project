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
        <TableRow>
          <TableCell>Metric Name</TableCell>
          <TableCell align="right">Color</TableCell>
          <TableCell align="right">Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.selectedMetrics.map((metric) => {          
          return (
            <Zoom in={true} timeout={750}>
              <TableRow key={metric.value}>
                <TableCell component="th" scope="row">
                  {metric.value}
                </TableCell>   
                <TableCell align="right" style={{color: metric.color}}>{metric.color}</TableCell>
                <TableCell align="right">{props.subscriptionState[metric.value]}</TableCell>
              </TableRow>
            </Zoom>  
          )
        })}      
      </TableBody>
    </Table>
  );
}
export default MyTable;