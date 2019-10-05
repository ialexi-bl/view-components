# View Components

## Motivation

This library has been inspired by [`styled-components`](https://www.styled-components.com/) and [`classnames`](https://github.com/JedWatson/classnames)

`styled-components` is an awesome library, it's very convenient if you are writing your styles manually. Nevertheless, it is harder to deal with it when you want to use a CSS framework, such as Bootstrap or Tailwind. This tiny zero dependency library provides an easy way to create small stateless view components by assigning the CSS classNames conditionally.

## Installation

Install the library using

```
npm install --save view-components
```

or

```
yarn add view-components
```

## Usage

You probably wrote some components like this one day:

```javascript
import React from 'react'
import classNames from 'classnames'

const Button = ({ className, ...props }) => (
  <button
    className={classNames(className, 'standard class-names for-every button')}
    {...props}
  />
)
```

This library basically does the same, but it makes your code much cleaner. The syntax is very similar to `styled-components` (If you are not familiar with the tagged templates syntax, check the [MDN article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)):

```javascript
import React from 'react'
import view from 'view-components'

const Button = view.button`
  standard class-names for-every button
`
```

This will create a `<Button/>` component, which will render a `<button/>` element. All props, including the `className`, will be forwarded. This means that

```jsx
<Button className={'disabled'} type={'submit'}>
  foobar
</Button>
```

will result in

```html
<button class="standard class-names for-every button disabled" type="submit">
  foobar
</button>
```

Tagged templates allow you to use any values, including functions, inside template strings. Here we can use this fact

### Primitives

You can insert any primitives, they will just be converted into strings

```javascript
const padding = 'px-3 py-1'
const margin = 3

const Button = view.button`
  ${padding} m-${margin}
`
```

If you use this component, you will get

```html
<button class="px-3 py-1 m-3"></button>
```

### Functions

Functions are the main way to make your components dynamic. If you pass a function when creating a component, it will be called every time the component is rendered. Whatever the function returns will be used as className. The function will receive component's props as its only argument, so that you can decide, what classNames to apply:

```javascript
const Button = view.button`
  btn
  ${props => (props.disabled ? 'btn-disabled' : 'btn-enabled')}
`
```

```jsx
<Button />
// becomes
<button class="btn btn-enabled"></button>

<Button disabled />
// becomes
<button class="btn btn-disabled"></button>
```

Functions may also return arrays or objects (but not other functions)

### Objects

Objects use the same syntax as in `classnames` package. Object's keys are classNames and values are booleans, indicating whether the className should be applied or not. You can also pass a function as a value. In this case it will be called during every render with the component's props and it must return a boolean to decide whether the className should be applier or not.

```javascript
const Button = view.button`
  ${{
    foo: true,
    bar: false,
    large: props => props.size === 'lg'
  }}
`
```

Here `foo` className will always be applied, `bar` will always be ignored and `large` will be used only if the `size` prop is equal to `'lg'`

### Arrays

Any arrays you pass will be flattened and used as classNames. You can pass anything inside of an array: primitives, functions, objects or other arrays - the array will be flattened. It means that

```javascript
const classes = ['btn', 'btn-lg']
const Button = view.button`
  ${classes}
  ${[
    273,
    ['foo', ['bar']],
    props => props.disabled && 'disabled',
    {
      foobar: true,
      baz: false
    }
  ]}
`
```

is basically the same as

```javascript
const Button = view.button`
  ${'btn'} ${'btn-lg'}
  ${273}
  ${'foo'} ${'bar'}
  ${props => props.disabled && 'disabled'}
  ${{
    foobar: true,
    baz: false
  }}
`
```

## Using with other components

When you do

```javascript
import view from 'view-components'
```

You actually get a function. It accepts the only argument - the component it should render. It may be a string for HTML elements or a function or class for React components. It will work fine as long as the component you pass accepts the `className` prop:

```javascript
const Container = view('article')`
  ${/* ... */}
`
```

```javascript
function SuperComplicatedSwitch({ className, onClick, ...props }) {
  /* Super complicated and important stuff */

  return (
    // className may be applied anywhere in the components tree
    <div className={className}>
      {/* Other components */}
    </div>
  )
}

function FancySwitch = view(SuperComplicatedSwitch)`
  ${/* ... */}
`
```

This `view` function has some nice shortcuts for most HTML elements, exported as its properties. So `view.img` is the same as `view('img')`.
