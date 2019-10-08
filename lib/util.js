/**
 * Merges strings and interpolations
 * @param {string[]} strings
 * @param {any[]} interpolations
 * @returns {any[]}
 */
export function interleave(strings, interpolations) {
  var result = [strings[0]]

  for (var i = 0, len = interpolations.length; i < len; i += 1) {
    result.push(interpolations[i], strings[i + 1])
  }

  return result
}

/**
 * Transforms an object into classNames array
 * @param {Object<string, boolean | function>} obj
 */
export function objToClassNames(obj) {
  return Object.keys(obj)
    .map(x =>
      typeof obj[x] === 'function'
        ? // Change `className: (props) => boolean` syntax
          // into `(props) => className`
          props => (obj[x](props) ? x : '')
        : obj[x]
        ? x
        : ''
    )
    .filter(Boolean)
}

/**
 * Flattens an array of interpolations, formats an object
 * or puts a primitive into an array
 * @param {any} interpolations
 * @return {any[]}
 */
export function flatten(interpolations) {
  if (!Array.isArray(interpolations)) {
    return typeof interpolations === 'object' && interpolations !== null
      ? objToClassNames(interpolations)
      : [interpolations]
  }

  return interpolations.reduce(
    (accumulator, interpolation) =>
      accumulator.concat(
        typeof interpolation === 'object' && interpolation != null
          ? flatten(objToClassNames(interpolation))
          : Array.isArray(interpolation)
          ? flatten(interpolation)
          : interpolation
      ),
    []
  )
}

export function normalize(str) {
  return str.trim().replace(/\s{2,}/g, ' ')
}

/**
 * Creates dynamic classNames getter
 * @param {((props: object) => any)[]} functions
 * @returns {(props: object) => string}
 */
export function createClassNameGetter(functions) {
  return props => {
    const classNames = flatten(functions.map(x => x(props)))
    if (
      process.env.NODE_ENV !== 'production' &&
      classNames.some(x => typeof x === 'function')
    ) {
      console.error('Function in View component may not return other functions')
    }

    return normalize(
      classNames
        .map(x => String(x).trim())
        .filter(Boolean)
        .join(' ')
    )
  }
}

/**
 * Separates constant interpolations and dynamic functions
 * @param {any[]} interpolations
 * @returns {{
 *  constants: string[],
 *  isStatic: boolean,
 *  getClassNames: ((props: object) => string) | null
 * }}
 */
export function formatInterpolations(interpolations) {
  const constants = []
  const functions = []

  flatten(interpolations).forEach(
    x =>
      x &&
      (typeof x !== 'string' || x.trim()) &&
      (typeof x === 'function'
        ? functions.push(x)
        : constants.push(String(x).trim()))
  )

  return {
    constants: normalize(constants.filter(Boolean).join(' ')),
    isStatic: !functions.length,
    getClassNames: functions.length && createClassNameGetter(functions),
  }
}
