_ChartFlows.classes.canvas = class {
    constructor(element) {
        this._$element = element;
        this._blocks = {}
    }

    init() {
        this._hDrop = _ChartFlows.utils.drop(this._$element);
        this._$element.droppable({
            deactivate: this._hDrop.deactivateHandle,
            drop: this._hDrop.dropHandle,
            out: this._hDrop.outHandle,
            over: this._hDrop.overHandle
        })
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