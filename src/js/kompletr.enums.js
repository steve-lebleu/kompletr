/**
 * @description Animation types
 */
const animation = Object.freeze({
  fadeIn: 'fadeIn',
  slideDown: 'slideDown',
});

/**
 * @description Data origins
 */
const origin = Object.freeze({
  cache: 'cache',
  callback: 'callback',
  local: 'local',
});

/**
 * @description Search expression values
 */
const searchExpression = Object.freeze({
  prefix: 'prefix',
  expression: 'expression',
});

/**
 * @description Theme values
 */
const theme = Object.freeze({
  light: 'light',
  dark: 'dark',
});

export { animation, origin, searchExpression, theme }