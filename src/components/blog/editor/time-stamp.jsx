import 'date-fns';
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';

const styles = {
  grid: {
    width: '60%',
  },
};

class TimestampPicker extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {
    const { classes, ts } = this.props;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container className={classes.grid} justify="space-around">
          <DateTimePicker
            value={ts}
            disablePast
            onChange={this.props.update}
            label="Post Date"
            showTodayButton
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }
}

TimestampPicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimestampPicker);
