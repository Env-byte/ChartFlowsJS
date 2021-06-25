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

        this.id = _ChartFlows.utils.statics.genId()
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
        this._hDrag = _ChartFlows.utils.drag(canvas);

        this.$canvas = canvas;
        this.template = ChartFlows.config.getTemplate(this.type);

        this.$ = $(this._hTemplate.parse(this, this.template)).appendTo(this.$canvas);
        this.$.attr('id', 'block' + this.id);
        this._addDataAttr();
    }

    /**
     *
     * @private
     */
    _addDataAttr() {
        console.log(this.info.data);
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
