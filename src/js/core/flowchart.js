let _ChartFlowsCanvas = class {
    constructor(element) {
        this._$element = element;
        this._blocks = {}
    }


    get blocks() {
        return this._blocks;
    }

    /**
     *
     * @param {_Block} value
     */
    addBlock(value) {
        if (value instanceof _Block) {
            this._blocks[value.id] = value;
        }
    }
}