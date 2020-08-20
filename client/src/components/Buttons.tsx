import React from 'react'
import { ButtonProps } from '@material-ui/core'
import { Button } from '@material-ui/core'

export const DoneUndoButton: React.FC<
  { completed: boolean } & Omit<ButtonProps, 'children'>
> = ({ completed, ...props }) => (
  <Button size="small" color="primary" {...props}>
    {completed ? 'Undo' : 'Done'}
  </Button>
)

export const DeleteButton: React.FC<Omit<ButtonProps, 'children'>> = (
  props
) => (
  <Button size="small" color="secondary" {...props}>
    Delete
  </Button>
)
