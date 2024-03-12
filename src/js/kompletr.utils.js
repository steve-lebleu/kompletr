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

export { build }