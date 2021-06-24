/**
 * @typedef {object} BlockInfo
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 */

/**
 *
 * @type {_ChartFlowsBlocklist}
 * @private
 */
let _ChartFlowsBlocklist = class {
    constructor(element) {
        this._$element = element;
        this._blocks = []
    }

    /**
     *
     * @param {string} type
     * @param {BlockInfo} blockInfo
     */
    add(type, blockInfo) {
        let classDef = ChartFlows.getBlock(type);
        if (classDef) {
            let blockObj = new classDef();
            blockObj.info = blockInfo;
            let id = blockObj.init();
            this._blocks.push(blockObj)
        }
    }
}