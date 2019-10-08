import { filterProps, generateDisplayName, isTag } from '../lib/pure-util'
import { formatInterpolations, interleave } from '../lib/util'

import React from 'react'
import domElements from '../lib/domElements'

function createViewComponent(Component, strings, interpolations) {
  let { constants, getClassNames, isStatic } = formatInterpolations(
    interleave(strings, interpolations)
  )
  const tag = isTag(Component)

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
        {...(tag ? filterProps(rest) : rest)}
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
