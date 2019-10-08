import isValidAttr from '@emotion/is-prop-valid'

/**
 * Removes props that do not belong to DOM nodes
 * @param {object} props
 * @returns {object}
 */
export function filterProps(props) {
  const result = {}
  Object.keys(props).forEach(p => isValidAttr(p) && (result[p] = props[p]))
  return result
}

/**
 * Tries to retrieve component's display name
 */
export function getComponentName(target) {
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
export function isTag(target) {
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
export function generateDisplayName(target) {
  return isTag(target)
    ? 'view.' + target
    : 'View(' + getComponentName(target) + ')'
}
