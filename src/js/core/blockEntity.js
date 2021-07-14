_ChartFlows.classes.blockEntity = class {
    /**
     *
     * @param  $ele
     * @param {_Block} value
     * @param {_ChartFlows.classes.canvas } canvas
     */
    constructor($ele, value, canvas) {
        this._info = value.info;
        this._canvas = canvas;
        this._instanceOf = value.id;
        this._id = 'Entity_' + _ChartFlows.utils.statics.genId()
        this.$ = $ele;
        this._init();
    }

    /**
     *
     * @private
     */
    _init() {
        this.$.attr('id', this._id);
        this.$.removeClass('can-drop');

        this._hDrag = _ChartFlows.utils.drag(this._id);

        this.$.draggable({
            containment: this._canvas.element,
            snap: '', // create an indicator to snap to, then draw arrow from this block to the next
            revert: '', // todo check if can snap if now revert
            drag: this._hDrag.moveBlock,
            start: this._hDrag.startHandle,
            stop: this._hDrag.endHandle,
        })
    }

    /**
     *
     * @returns {string}
     */
    get id() {
        return this._id;
    }
}