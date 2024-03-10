/**
* @description Build an HTML element and set his attributes
* 
* @param {String} element HTML tag to build
* @param {Object[]} attributes Key / values pairs
* 
* @returns {HTMLElement}
*/
const build = (element, attributes = []) => {
 const htmlElement = document.createElement(element);
 attributes.forEach(attribute => {
   htmlElement.setAttribute(Object.keys(attribute)[0], Object.values(attribute)[0]);
 });
 return htmlElement;
};

/**
* @description Get a simple uuid generated from given string
* 
* @param {String} string The string to convert in uuid
* 
* @returns {String} The generate uuid value
*/
const uuid = (string) => {
 return string.split('')
   .map(v => v.charCodeAt(0))
   .reduce((a, v) => a + ((a<<7) + (a<<3)) ^ v)
   .toString(16);
};

export { build, uuid }