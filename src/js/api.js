_ChartFlows.api = class {
    constructor() {
        this._blocks = {};
        this._symbols = {};
        this._version = 1.0;
        this._config = new _ChartFlows.config();

        /**
         *
         * @type {eventHandles}
         */
        this._events = {
            ondragstart: undefined,
            ondragend: undefined
        }

    }

    /**
     *
     * @param key
     * @returns {function|boolean}
     */
    getBlock(key) {
        if (this._blocks.hasOwnProperty(key)) {
            return this._blocks[key];
        } else {
            console.error('Block ' + key + ' is not set');
            return false
        }
    }

    /**
     *
     * @param {String} key
     * @param {Object} value
     */
    addBlock(key, value) {
        this._blocks[key] = value;
    }

    /**
     *
     * @param {String} key
     * @returns {function|boolean}
     */
    getSymbol(key) {
        if (this._symbols.hasOwnProperty(key)) {
            return this._symbols[key];
        } else {
            console.error('Symbol ' + key + ' is not set');
            return false
        }
    }

    /**
     *
     * @param {String} key
     * @param {Object} value
     */
    addSymbol(key, value) {
        this._symbols[key] = value;
    }

    /**
     *
     * @param {eventHandles|null} events
     * @returns {{blocklist: (function(): _ChartFlowsBlocklist), flowchart: (function(): _ChartFlowsCanvas)}}
     */
    init(events) {

        if (events) {
            this.config.events = events;
        }

        if (this.config.debug === 1) {
            console.log('ChartFlows ' + this._version + ' debugging enabled');
            console.log('init ChartFlows');
        }

        let _flowchart = new _ChartFlowsCanvas(this.config.container);
        let _blocklist = new _ChartFlowsBlocklist(this.config.blockList);

        return {
            flowchart: () => {
                return _flowchart
            },
            blocklist: () => {
                return _blocklist
            },
        }
    }

    /**
     *
     * @returns {_ChartFlows.config}
     */
    get config() {
        return this._config;
    }

    get events() {
        return this._events;
    }
}