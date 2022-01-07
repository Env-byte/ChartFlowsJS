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
     * @param {{}} blockInfo
     */
    add(type, blockInfo) {
        let classDef = ChartFlows.getBlock(type);
        if (classDef) {

            if (!blockInfo.hasOwnProperty('id') || blockInfo.id === '') {
                console.error('The block must have an id')
                return;
            }

            let blockObj = new classDef(blockInfo.id);

            //remove from the info
            delete blockInfo.id;

            blockObj.info = blockInfo;
            blockObj.init(this._$element);

            if (ChartFlows.config.debug === 1) {
                console.log('Created Block', blockObj);
            }

            this._blocks[blockObj.id] = (blockObj)
        }
    }

    get blocks() {
        return this._blocks;
    }

    /**
     *
     * @param id
     * @returns {boolean|_ChartFlows.classes._Block}
     */
    getBlock(id) {
        if (this._blocks.hasOwnProperty(id)) {
            return this._blocks[id];
        } else {
            return false;
        }
    }
}