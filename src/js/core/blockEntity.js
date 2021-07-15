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

        this._createSnapIndicator();

        this._hDrag = _ChartFlows.utils.drag(this._id);
        this.$.draggable({
            containment: this._canvas.element,
            snap: '.snapIndicator', // create an indicator to snap to, then draw arrow from this block to the next
            snapMode: 'outer',
            snapTolerance : '20',
            revert: '', // todo check if can snap if now revert
            drag: this._hDrag.moveBlock,
            start: this._hDrag.startHandle,
            stop: this._hDrag.endHandle,
        })
    }

    _createSnapIndicator() {
        let width = this.$.width();
        let left = (width / 2) - 6 // -6 as the indicator has width of 12 (in the scss file)
        let style = 'left:' + left + 'px;bottom:-6px;';

        let indicator = $('<div style="' + style + '" class="snapIndicator"></div>');
        console.log(indicator);
        this.$.append(indicator);

    }

    /**
     *
     * @returns {string}
     */
    get id() {
        return this._id;
    }
}