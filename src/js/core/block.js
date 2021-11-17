_ChartFlows.classes._Block = class {

    constructor(id) {
        /**
         * Helpers - initialised in init
         */
        this._hTemplate = undefined;
        this._hDrag = undefined;

        this.info = {};
        this.cavasTemplate = undefined;
        this.listTemplate = undefined
        this.$ = undefined;

        this.id = id;
        this.type = 'Base'
    }

    /**
     *
     * @param {jQuery|HTMLElement} $blockList
     */
    init($blockList) {
        /**
         * Initialise Helpers
         */
        this._hTemplate = _ChartFlows.utils.template();
        this._hDrag = _ChartFlows.utils.drag(this.id);

        this.listTemplate = ChartFlows.config.getTemplate('ListTemplate');

        this.cavasTemplate = ChartFlows.config.getTemplate(this.type);

        let html = this._hTemplate.parse(this.listTemplate, this);

        if ($blockList) {
            this.$ = $(html).appendTo($blockList);
        } else {
            this.$ = $(html)
        }
        this.$.attr('id', this.id);
        this.$.addClass('ui-widget-content').addClass('block-item').addClass('can-drop');
        this._addDataAttr();

        if (!_ChartFlows.utils.statics.getApi().config.disableDrag) {
            if (this.info.hasOwnProperty('hidden') && this.info.hidden) {
                this.$.hide();
            } else {
                if ($blockList) {
                    this._setDraggable();
                }
            }
        }
    }

    /**
     *
     * @private
     */
    _setDraggable() {
        this.$.draggable({
            helper: "clone",
            snap: '.snapIndicator',
            snapMode: 'outer',
            snapTolerance: ChartFlows.config.snapTolerance,
            drag: this._hDrag.moveBlock,
            start: this._hDrag.startHandle,
            stop: this._hDrag.endHandle,
        })
    }

    /**
     *
     * @return {html}
     */
    getCanvasHtml() {
        return this._hTemplate.parse(this.cavasTemplate, this)
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
}
ChartFlows.addBlock('Base', _ChartFlows.classes._Block);