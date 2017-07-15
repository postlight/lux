/* @flow */

type TwoDimArray<T> = Array<T | Array<T>>
type MultiDimArray<T> = Array<$Supertype<T | MultiDimArray<T>>>

export const shallow = <T>(source: TwoDimArray<T>): Array<T> =>
  Array.prototype.concat.apply([], source)

export const deep = <T>(source: MultiDimArray<T>): Array<T> =>
  source.reduce((dest, node) => {
    let flatNode = node

    if (Array.isArray(flatNode)) {
      flatNode = deep(flatNode)
    }

    return dest.concat(flatNode)
  }, [])
