import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const styles = {
  card: {
    width: 250,
    padding: '0px',
    margin: '10px 0px'
  },
};

const Todo = ({ classes, onClick, onClickDelete, completed, text }) => {
  return (
    <Card className={classes.card}>
      <CardContent>
        {text}
        <Button
          size="small"
          onClick={onClick}
          color="primary"
        >
          {completed ? 'reDone' : 'Done'}
        </Button>
        <Button
          size="small"
          onClick={onClickDelete}
          color="secondary"
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Todo);
