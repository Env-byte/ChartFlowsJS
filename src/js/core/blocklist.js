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
            /**
             * @type _Block
             */
            let blockObj = new classDef();
            blockObj.info = blockInfo;
            let html = blockObj.generateBlock();

            if (ChartFlows.config.debug === 1) {
                console.log('Created Block', blockObj);
            }

            this._blocks.push(blockObj)
            this._$element.append(html);
        }
    }
}