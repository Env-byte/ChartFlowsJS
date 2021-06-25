
ChartFlows.addBlock('Base', class {
    constructor() {
        /**
         *
         * @type {BlockInfo}
         */
        this.info = undefined;
        this.template = undefined;
        this.id = StaticHelpers._genId()
        this.type = 'Base'
    }

    generateBlock() {
        this.template = ChartFlows.config.getTemplate(this.type);
        let handler = _TemplateHandler();
        return handler.parse(this, this.template);
    }

});

/**
 *
 * @type {_Block}
 * @private
 */
const _Block = ChartFlows.getBlock('Base');
