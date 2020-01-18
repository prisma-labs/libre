/**
 * Indent a string that spans multiple lines.
 */
export function indentBlock(size: number, block: string): string {
  return block
    .split('\n')
    .map(
      line =>
        range(size)
          .map(constant(' '))
          .join('') + line
    )
    .join('\n')
}

export const indentBlock4 = indentBlock.bind(null, 4)

/**
 * Create a function that will only ever return the given value when called.
 */
export const constant = <T>(x: T): (() => T) => {
  return function() {
    return x
  }
}

/**
 * Create a range of integers.
 */
const range = (times: number): number[] => {
  const list: number[] = []
  while (list.length < times) {
    list.push(list.length + 1)
  }
  return list
}

// type IndexableKeyTypes = string | number | symbol

// type Indexable<T = unknown> = Record<string | number, T>

// type JustIndexableTypes<T> = T extends IndexableKeyTypes ? T : never

// type KeysMatching<Rec, Keys> = NonNullable<
//   {
//     [RecKey in keyof Rec]: Rec[RecKey] extends Keys ? RecKey : never
//   }[keyof Rec]
// >

// export type GroupBy<T extends Indexable, K extends IndexableKeys<T>> = {
//   [KV in JustIndexableTypes<T[K]>]?: Array<T extends Record<K, KV> ? T : never>
// }

// type IndexableKeys<Rec> = KeysMatching<Rec, IndexableKeyTypes>

// export function groupByProp<
//   Obj extends Indexable,
//   KeyName extends IndexableKeys<Obj>
// >(xs: Obj[], keyName: KeyName): GroupBy<Obj, KeyName> {
//   type KeyValue = JustIndexableTypes<Obj[KeyName]>
//   const seed = {} as GroupBy<Obj, KeyName>

//   return xs.reduce((groupings, x) => {
//     const groupName = x[keyName] as KeyValue

//     if (groupings[groupName] === undefined) {
//       groupings[groupName] = []
//     }

//     // We know the group will exist, given above initializer.
//     groupings[groupName]!.push(
//       x as Obj extends Record<KeyName, KeyValue> ? Obj : never
//     )

//     return groupings
//   }, seed)
// }

/**
 * Use this to make assertion at end of if-else chain that all members of a
 * union have been accounted for.
 */
export function assertAllCasesHandled(x: never): void {
  throw new Error(`A case was not handled for value: ${x}`)
}

/**
 * Determin if the given array or object is empty.
 */
export function isEmpty(x: {} | unknown[]): boolean {
  return Array.isArray(x) ? x.length === 0 : Object.keys(x).length > 0
}

/**
 * Pause in time for given milliseconds.
 */
export function delay(milliseconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, 1000)
  })
}

/**
 * Like Array.findIndex but working backwards from end of array.
 */
export function findIndexFromEnd<T>(xs: T[], f: (x: T) => boolean): number {
  for (let index = xs.length - 1; index > -1; index--) {
    if (f(xs[index])) return index
  }
  return -1
}

/**
 * Get the last element of an array.
 */
export function last<T>(xs: T[]): null | T {
  if (xs.length === 0) return null
  return xs[xs.length - 1]
}

/**
 * Detect if being run within a yarn or npm script. Ref
 * https://stackoverflow.com/questions/51768743/how-to-detect-that-the-script-is-running-with-npm-or-yarn/51793644#51793644
 */
export function detectScriptRunner(): null | 'npm' | 'yarn' {
  if (process.env.npm_execpath?.match(/.+npm-cli.js$/)) return 'npm'
  if (process.env.npm_execpath?.match(/.+yarn.js$/)) return 'yarn'
  return null
}
