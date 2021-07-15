ChartFlows.addBlock('Base', class {
    constructor() {
        /**
         * Helpers - initialised in init
         */
        this._hTemplate = undefined;
        this._hDrag = undefined;
        /**
         *
         * @type {BlockInfo}
         */
        this.info = undefined;
        this.template = undefined;
        this.$canvas = undefined;
        this.$ = undefined;

        this.id = 'block' + _ChartFlows.utils.statics.genId()
        this.type = 'Base'
    }

    /**
     *
     * @param {jQuery|HTMLElement} canvas
     */
    init(canvas) {
        /**
         * Initialise Helpers
         */
        this._hTemplate = _ChartFlows.utils.template();
        this._hDrag = _ChartFlows.utils.drag(this.id);

        this.template = ChartFlows.config.getTemplate(this.type);

        this.$ = $(this._hTemplate.parse(this, this.template)).appendTo(canvas);
        this.$.attr('id', this.id);
        this.$.addClass('ui-widget-content').addClass('block-item').addClass('can-drop');
        this._addDataAttr();

        this.$.draggable({
            helper: "clone",
            snap: '.snapIndicator',
            snapMode: 'outer',
            snapTolerance : '20',
            drag: this._hDrag.moveBlock,
            start: this._hDrag.startHandle,
            stop: this._hDrag.endHandle,
        })
    }

    /**
     *
     * @private
     */
    _addDataAttr() {
        if (this.info && Array.isArray(this.info.data)) {
            for (let i = 0, iL = this.info.data.length; i < iL; i++) {
                this.$.attr('data-' + this.info.data[i].name, this.info.data[i].value);
            }
        }
    }
});

/**
 *
 * @type {_Block}
 * @private
 */
const _Block = ChartFlows.getBlock('Base');
