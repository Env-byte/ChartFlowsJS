_ChartFlows.classes._Symbol = class {
    /**
     *
     * @param {_ChartFlows.utils.treeNode } parent
     */
    constructor(parent) {
        this._id = _ChartFlows.utils.statics.genId()
        this._parent = parent;
        this._$ = $();
    }

    get parent() {
        return this._parent;
    }

    get id() {
        return this._id;
    }

    show() {
        this._$.show()
    }

    hide() {
        this._$.hide()
    }

    /**
     *
     * @param {_ChartFlows.classes.blockEntity} startBlock
     * @param {_ChartFlows.classes.blockEntity} endBlock
     */
    render(startBlock, endBlock) {

    }

    remove() {

    }
}
ChartFlows.addSymbol('Symbol', _ChartFlows.classes._Symbol);