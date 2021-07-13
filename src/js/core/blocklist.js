_ChartFlows.classes.blockList = class {
    /**
     *
     * @param {jQuery} element
     */
    constructor(element) {
        this._$element = element;
        this._blocks = {}
    }

    /**
     *
     * @param {string} type
     * @param {BlockInfo} blockInfo
     */
    add(type, blockInfo) {
        let classDef = ChartFlows.getBlock(type);

        if (classDef) {
            /**
             * @type _Block
             */
            let blockObj = new classDef();

            blockObj.info = blockInfo;
            blockObj.init(this._$element);

            if (ChartFlows.config.debug === 1) {
                console.log('Created Block', blockObj);
            }

            this._blocks[blockObj.id] = (blockObj)
        }
    }

    /**
     *
     * @param id
     * @returns {boolean|_Block}
     */
    getBlock(id) {
        if (this.hasOwnProperty(id)) {
            return this._blocks[id];
        } else {
            return false;
        }

    }
}