_ChartFlows.classes._Symbol = class {
    /**
     *
     * @param {_ChartFlows.utils.treeNode } parent
     */
    constructor(parent) {
        this._id = _ChartFlows.utils.statics.genId()
        this._parent = parent;
        this._$ = $();
        this.linkedTo = '';
        this.data = new _ChartFlows.utils.data();
    }

    get parent() {
        return this._parent;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
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
        this._$.remove();
    }

    get $() {
        return this._$;
    }

    serialize() {
        return {
            id: this._id,
            data: this.data.serialize(),
            linkedTo: this.linkedTo
        }
    }
}
ChartFlows.addSymbol('Symbol', _ChartFlows.classes._Symbol);