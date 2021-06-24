ChartFlows.addBlock('Base', class {
    constructor() {
        /**
         *
         * @type {BlockInfo}
         */
        this.info = undefined;
        this.template = undefined;
    }


    init() {
        return 'someid1';
    }
});
const _Block = ChartFlows.getBlock('Base');
