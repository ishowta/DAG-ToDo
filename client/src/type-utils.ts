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

export const makeDictFromArray = function <T, U>(
  arr: T[],
  callbackfn: (value: T, index?: number) => { key: string; value: U }
): { [key: string]: U } {
  return arr.reduce<{ [key: string]: U }>((dict, value, index) => {
    const res = callbackfn(value, index)
    dict[res.key] = res.value
    return dict
  }, {})
}

export const comp = (a: number, b: number): -1 | 0 | 1 =>
  a < b ? -1 : a > b ? 1 : 0
