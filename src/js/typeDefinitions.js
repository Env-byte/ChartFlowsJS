/**
 *
 * @typedef {Function} _Block
 * @property {BlockInfo} info
 * @property {string} template
 * @property {string} id
 * @property {jQuery} $
 * @property {function} init setup the block, bind events and add data attr
 */

/**
 *
 * @typedef {Function} _Symbol
 * @property {string} _id
 * @property {jQuery} _$
 * @property {_ChartFlows.utils.treeNode } _parent
 * @property {Function} render
 * @property {Function} remove
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

