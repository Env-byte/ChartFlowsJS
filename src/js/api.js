_ChartFlows.api = class {
    constructor() {
        this._blocks = {};
        this._symbols = {};
        this._version = 1.0;
        this._config = new _ChartFlows.config();
        this._canvas = null;
        this._blockList = null;
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
     * @param {jQuery} container
     * @param {jQuery} blockList
     * @param {eventHandles|null} events
     */
    init(container, blockList, events) {

        if (events) {
            this.config.events = events;
        }

        if (this.config.debug === 1) {
            console.log('ChartFlows ' + this._version + ' debugging enabled');
            console.log('init ChartFlows');
        }

        this._canvas = new _ChartFlows.classes.canvas(container, this);
        this._blockList = new _ChartFlows.classes.blockList(blockList);
    }

    /**
     *
     * @returns {_ChartFlows.classes.canvas}
     */
    get canvas() {
        return this._canvas;
    }

    /**
     *
     * @returns {_ChartFlows.classes.blockList}
     */
    get blockList() {
        return this._blockList;
    }

    /**
     *
     * @returns {_ChartFlows.config}
     */
    get config() {
        return this._config;
    }

    /**
     *
     * @returns {eventHandles}
     */
    get events() {
        return this._events;
    }
}