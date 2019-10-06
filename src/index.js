import React from 'react'

const domElements = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'marquee',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
  'circle',
  'clipPath',
  'defs',
  'ellipse',
  'foreignObject',
  'g',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'text',
  'tspan'
]

/**
 * Merges strings and interpolations
 * @param {string[]} strings
 * @param {any[]} interpolations
 * @returns {any[]}
 */
function interleave(strings, interpolations) {
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
function objToClassNames(obj) {
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
    .filter(x => x)
}

/**
 * Flattens an array of interpolations, formats an object
 * or puts a primitive into an array
 * @param {any} interpolations
 * @return {any[]}
 */
function flatten(interpolations) {
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

function normalize(str) {
  return str.trim().replace(/\s{2,}/g, ' ')
}

/**
 * Creates dynamic classNames getter
 * @param {((props: object) => any)[]} functions
 * @returns {(props: object) => string}
 */
function createClassNameGetter(functions) {
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
        .filter(x => x)
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
function formatInterpolations(interpolations) {
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
    constants: normalize(constants.filter(x => x).join(' ')),
    isStatic: !functions.length,
    getClassNames: functions.length && createClassNameGetter(functions)
  }
}

/**
 * Tries to retrieve component's display name
 */
function getComponentName(target) {
  return (
    (process.env.NODE_ENV !== 'production'
      ? typeof target === 'string' && target
      : false) ||
    target.displayName ||
    target.name ||
    'Component'
  )
}

/**
 * Check whether the component is html tag
 */
function isTag(target) {
  return (
    typeof target === 'string' &&
    (process.env.NODE_ENV !== 'production'
      ? target.charAt(0) === target.charAt(0).toLowerCase()
      : true)
  )
}

/**
 * Creates a display name for a component
 */
function generateDisplayName(target) {
  return isTag(target)
    ? 'view.' + target
    : 'View(' + getComponentName(target) + ')'
}

function createViewComponent(Component, strings, interpolations) {
  let { constants, getClassNames, isStatic } = formatInterpolations(
    interleave(strings, interpolations)
  )

  function ViewComponent(props, ref) {
    const { className, ...rest } = props

    return (
      <Component
        ref={ref}
        className={
          (className ? className + ' ' : '') +
          (constants && constants + ' ') +
          (isStatic ? '' : getClassNames(props))
        }
        {...rest}
      />
    )
  }

  ViewComponent.displayName = generateDisplayName(Component)

  return React.forwardRef(ViewComponent)
}

function createTemplateConstructor(Component) {
  return function templateConstructor(strings, ...interpolations) {
    return createViewComponent(Component, strings, interpolations)
  }
}

function view(Component) {
  return createTemplateConstructor(Component)
}

domElements.forEach(element => {
  view[element] = (...args) => view(element)(...args)
})

export default view
