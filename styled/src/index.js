import { formatInterpolations, interleave } from '../../lib/util'

import domElements from '../../lib/domElements'
import styled from 'styled-components'

function forwardComponent(Component, strings, interpolations) {
  let { constants, getClassNames, isStatic } = formatInterpolations(
    interleave(strings, interpolations)
  )

  return styled(Component).attrs(props => ({
    className:
      (constants && constants + ' ') + (isStatic ? '' : getClassNames(props)),
  }))
}

function createTemplateConstructor(Component) {
  return function templateConstructor(strings, ...interpolations) {
    return forwardComponent(Component, strings, interpolations)
  }
}

function view(Component) {
  return createTemplateConstructor(Component)
}

domElements.forEach(element => {
  view[element] = (...args) => view(element)(...args)
})

export default view
