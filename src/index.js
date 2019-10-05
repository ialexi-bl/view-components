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

function interleave(strings, interpolations) {
  var result = [strings[0]]

  for (var i = 0, len = interpolations.length; i < len; i += 1) {
    result.push(interpolations[i], strings[i + 1])
  }

  return result
}

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

function flatten(interpolation) {
  if (Array.isArray(interpolation)) {
    let classNames = []
    for (let i = 0, s = interpolation.length; i < s; i++) {
      const result = flatten(interpolation[i])

      if (!result) continue
      else if (Array.isArray(result)) classNames.push.apply(classNames, result)
      else classNames.push(result)
    }
    return classNames
  }

  if (!interpolation) {
    return null
  }

  if (typeof interpolation === 'object') {
    return objToClassNames(interpolation)
  }

  if (typeof interpolation === 'function') {
    return interpolation
  }

  return interpolation.toString().trim() || null
}

function normalize(str) {
  return str.trim().replace(/\s{2,}/g, ' ')
}

function stringify(classNames, props) {
  const result = classNames.map(x =>
    typeof x === 'function' ? flatten([x(props)]) : x
  )

  if (
    process.env.NODE_ENV === 'production' &&
    result.some(x => typeof x === 'function')
  ) {
    console.error(
      'Interpolated functions may not return other functions, because they will not be called.'
    )
  }

  return normalize(result.join(' '))
}

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

function isTag(target) {
  return (
    typeof target === 'string' &&
    (process.env.NODE_ENV !== 'production'
      ? target.charAt(0) === target.charAt(0).toLowerCase()
      : true)
  )
}

function generateDisplayName(target) {
  return isTag(target)
    ? 'styled.' + target
    : 'Styled(' + getComponentName(target) + ')'
}

function createViewComponent(Component, strings, interpolations) {
  let classNames = flatten(interleave(strings, interpolations))
  const isStatic = !classNames.some(x => typeof x === 'function')

  if (isStatic) {
    classNames = normalize(classNames.join(' '))
  }

  const forwardRef = function forwardRef(props, ref) {
    return React.create
  }

  function ViewComponent(props, ref) {
    const { className, ...rest } = props

    return (
      <Component
        ref={ref}
        className={
          (className ? className + ' ' : '') +
          (isStatic ? classNames : stringify(classNames, props))
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
