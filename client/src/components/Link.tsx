import React, { ReactNode } from 'react'
import { OnClickType } from '../type-utils'
import { DeepReadonly } from 'utility-types'
import styled from 'styled-components'

export type LinkPropTypes = DeepReadonly<{
  active?: boolean
  children: ReactNode
  onClick: OnClickType
}>

const LinkButton = styled.button`
  margin-left: 4px;
`

const Link: React.FC<LinkPropTypes> = (props) => (
  <LinkButton
    onClick={props.onClick}
    disabled={props.active !== undefined ? !props.active : false}
  >
    {props.children}
  </LinkButton>
)

export default Link
