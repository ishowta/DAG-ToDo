import React from 'react'
import { ButtonProps, Button as MaterialUIButton } from '@material-ui/core'

export const Button: React.FC<React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>> = ({ children, ...props }) => (
  <button type="button" {...props}>
    {children}
  </button>
)

export const DoneUndoButton: React.FC<
  { completed: boolean } & Omit<ButtonProps, 'children'>
> = ({ completed, ...props }) => (
  <MaterialUIButton size="small" color="primary" {...props}>
    {completed ? 'Undo' : 'Done'}
  </MaterialUIButton>
)

export const DeleteButton: React.FC<Omit<ButtonProps, 'children'>> = (
  props
) => (
  <MaterialUIButton size="small" color="secondary" {...props}>
    Delete
  </MaterialUIButton>
)
