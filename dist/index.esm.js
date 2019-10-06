"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var domElements = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'marker', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];
/**
 * Merges strings and interpolations
 * @param {string[]} strings
 * @param {any[]} interpolations
 * @returns {any[]}
 */

function interleave(strings, interpolations) {
  var result = [strings[0]];

  for (var i = 0, len = interpolations.length; i < len; i += 1) {
    result.push(interpolations[i], strings[i + 1]);
  }

  return result;
}
/**
 * Transforms an object into classNames array
 * @param {Object<string, boolean | function>} obj
 */


function objToClassNames(obj) {
  return Object.keys(obj).map(function (x) {
    return typeof obj[x] === 'function' ? // Change `className: (props) => boolean` syntax
    // into `(props) => className`
    function (props) {
      return obj[x](props) ? x : '';
    } : obj[x] ? x : '';
  }).filter(function (x) {
    return x;
  });
}
/**
 * Flattens an array of interpolations, formats an object
 * or puts a primitive into an array
 * @param {any} interpolations
 * @return {any[]}
 */


function flatten(interpolations) {
  if (!Array.isArray(interpolations)) {
    return _typeof(interpolations) === 'object' && interpolations !== null ? objToClassNames(interpolations) : [interpolations];
  }

  return interpolations.reduce(function (accumulator, interpolation) {
    return accumulator.concat(_typeof(interpolation) === 'object' && interpolation != null ? flatten(objToClassNames(interpolation)) : Array.isArray(interpolation) ? flatten(interpolation) : interpolation);
  }, []);
}

function normalize(str) {
  return str.trim().replace(/\s{2,}/g, ' ');
}
/**
 * Creates dynamic classNames getter
 * @param {((props: object) => any)[]} functions
 * @returns {(props: object) => string}
 */


function createClassNameGetter(functions) {
  return function (props) {
    var classNames = flatten(functions.map(function (x) {
      return x(props);
    }));

    if (process.env.NODE_ENV !== 'production' && classNames.some(function (x) {
      return typeof x === 'function';
    })) {
      console.error('Function in View component may not return other functions');
    }

    return normalize(classNames.map(function (x) {
      return String(x).trim();
    }).filter(function (x) {
      return x;
    }).join(' '));
  };
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


function format(interpolations) {
  var constants = [];
  var functions = [];
  flatten(interpolations).forEach(function (x) {
    return x && (typeof x !== 'string' || x.trim()) && (typeof x === 'function' ? functions.push(x) : constants.push(String(x).trim()));
  });
  return {
    constants: normalize(constants.filter(function (x) {
      return x;
    }).join(' ')),
    isStatic: !!functions.length,
    getClassNames: functions.length && createClassNameGetter(functions)
  };
}

function getComponentName(target) {
  return (process.env.NODE_ENV !== 'production' ? typeof target === 'string' && target : false) || target.displayName || target.name || 'Component';
}

function isTag(target) {
  return typeof target === 'string' && (process.env.NODE_ENV !== 'production' ? target.charAt(0) === target.charAt(0).toLowerCase() : true);
}

function generateDisplayName(target) {
  return isTag(target) ? 'view.' + target : 'View(' + getComponentName(target) + ')';
}

function createViewComponent(Component, strings, interpolations) {
  var _prepare = prepare(interleave(strings, interpolations)),
      constants = _prepare.constants,
      getClassNames = _prepare.getClassNames,
      isStatic = _prepare.isStatic;

  function ViewComponent(props, ref) {
    var className = props.className,
        rest = _objectWithoutProperties(props, ["className"]);

    return _react["default"].createElement(Component, _extends({
      ref: ref,
      className: (className ? className + ' ' : '') + (constants && constants + ' ') + (isStatic ? '' : getClassNames(props))
    }, rest));
  }

  ViewComponent.displayName = generateDisplayName(Component);
  return _react["default"].forwardRef(ViewComponent);
}

function createTemplateConstructor(Component) {
  return function templateConstructor(strings) {
    for (var _len = arguments.length, interpolations = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      interpolations[_key - 1] = arguments[_key];
    }

    return createViewComponent(Component, strings, interpolations);
  };
}

function view(Component) {
  return createTemplateConstructor(Component);
}

domElements.forEach(function (element) {
  view[element] = function () {
    return view(element).apply(void 0, arguments);
  };
});
var _default = view;
exports["default"] = _default;
