_ChartFlows.classes.blockEntity = class {
    /**
     *
     * @param {_Block} value
     */
    constructor(value) {
        this._info = value.info;
        this._instanceOf = value.id;
        this._id = 'Entity_' + _ChartFlows.utils.statics.genId()
    }

    /**
     *
     * @returns {string}
     */
    get id() {
        return this._id;
    }
}