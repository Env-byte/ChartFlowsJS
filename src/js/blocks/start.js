_ChartFlows.classes._Start = class extends _ChartFlows.classes._Block {
    constructor(id) {
        super(id);
        this.type = 'Start';
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
        this.template = ChartFlows.config.getTemplate(this.type);
        let html = this._hTemplate.parse(this, this.template);
        this.$ = $(html).appendTo($blockList);
        this.$.attr('id', this.id).addClass('block-item');

        if (this.info.hasOwnProperty('hidden') && this.info.hidden) {
            this.$.hide();
        }
        this._addDataAttr();
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
ChartFlows.addBlock('Start', _ChartFlows.classes._Start);