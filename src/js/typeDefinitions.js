/**
 *
 * @typedef {Function} _Block
 * @property {BlockInfo} info
 * @property {string} template
 * @property {string} id
 * @property {function} init setup the block, bind events and add data attr
 */

/**
 *
 * @typedef {Function} _Symbol
 * @property {string} id
 */

/**
 * @typedef {object} BlockDataAttr
 * @property {string} name
 * @property {string|number} value
 */

/**
 * @typedef {object} BlockInfo
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {BlockDataAttr[]} data
 */

/**
 * @typedef {object} eventHandles
 * @property {function|null} ondragstart
 * @property {function|null} ondragend
 */

