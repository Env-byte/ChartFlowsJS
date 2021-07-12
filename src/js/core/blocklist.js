_ChartFlows.classes.blockList = class {
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
}