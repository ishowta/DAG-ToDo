/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type OnClickType = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void

export type ActionsUnion<
  A extends {
    [actionCreator: string]: (...args: any[]) => any
  }
> = Exclude<ReturnType<A[keyof A]>, (...args: any[]) => Promise<void>>

export function makeDictFromArray<T extends unknown, U extends unknown>(
  arr: T[], // Couldn't change type to DeepReadonly because typescript error
  callbackfn: (value: T, index?: number) => { key: string; value: U }
): { [key: string]: U } {
  return arr.reduce<{ [key: string]: U }>((dict, value, index, array) => {
    const res = callbackfn(value, index)
    dict[res.key] = res.value
    return dict
  }, {})
}

export function bucket<T, U>(
  arr: T[],
  length: number,
  callbackfn: (value: T, index?: number) => { index: number; value: U }
): U[][] {
  const newArr = new Array<U[]>(length)
  arr.forEach((value, i) => {
    const { index: resIndex, value: resValue } = callbackfn(value, i)
    newArr[resIndex].push(resValue)
  })
  return newArr
}

export const comp = (a: number, b: number): -1 | 0 | 1 =>
  a < b ? -1 : a > b ? 1 : 0
