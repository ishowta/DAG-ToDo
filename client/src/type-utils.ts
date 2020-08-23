/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DeepReadonly } from 'utility-types'
import { _DeepReadonlyArray } from 'utility-types/dist/mapped-types'

export type OnClickType = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void

export type ActionsUnion<
  A extends {
    [actionCreator: string]: (...args: any[]) => any
  }
> = Exclude<ReturnType<A[keyof A]>, (...args: any[]) => Promise<void>>

export function makeDictFromArray<T, U>(
  arr: _DeepReadonlyArray<T>,
  callbackfn: (
    value: DeepReadonly<T>,
    index?: number
  ) => { key: string; value: U }
): { [key: string]: U } {
  const dict: { [key: string]: U } = {}
  arr.forEach((value, index) => {
    const res = callbackfn(value, index)
    dict[res.key] = res.value
  })
  return dict
}

export function bucket<T, U>(
  arr: T[],
  length: number,
  callbackfn: (value: T, index?: number) => { index: number; value: U }
): U[][] {
  const newArr: U[][] = new Array(length).map<U[]>(() => [])
  arr.forEach((value, i) => {
    const { index: resIndex, value: resValue } = callbackfn(value, i)
    if (newArr[resIndex] === undefined) {
      newArr[resIndex] = [resValue]
    } else {
      newArr[resIndex].push(resValue)
    }
  })
  return newArr
}

export const comp = (a: number, b: number): -1 | 0 | 1 =>
  a < b ? -1 : a > b ? 1 : 0
