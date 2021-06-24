let _ChartFlowsConfig = class {

    constructor() {
        this._debug = 0;
        this._container = $();
        this._blockList = $();
    }

    /**
     *
     * @returns {number}
     */
    get debug() {
        return this._debug;
    }

    /**
     *
     * @param {number} value
     */
    set debug(value) {
        this._debug = value;
    }

    /**
     *
     * @returns {jQuery|HTMLElement}
     */
    get container() {
        return this._container;
    }

    /**
     *
     * @param  {jQuery|HTMLElement} value
     */
    set container(value) {
        this._container = value;
    }

    /**
     *
     * @returns {jQuery|HTMLElement}
     */
    get blockList() {
        return this._blockList;
    }

    /**
     *
     * @param {jQuery|HTMLElement} value
     */
    set blockList(value) {
        this._blockList = value;
    }
}
let _ChartFlowsApi = class {
    constructor() {
        this._blocks = {};
        this._symbols = {};
        this._version = 1.0;
        this._config = new _ChartFlowsConfig();
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
     * @constructor
     */
    addBlock(key, value) {
        this._blocks[key] = value;
    }

    /**
     *
     * @param {String} key
     * @returns {function|boolean}
     * @constructor
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
     * @constructor
     */
    addSymbol(key, value) {
        this._symbols[key] = value;
    }

    init() {
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
     * @returns {_ChartFlowsConfig}
     */
    get config() {
        return this._config;
    }
}
if (typeof $ !== "function") {
    alert('jQuery is not loaded');
}
let ChartFlows = new _ChartFlowsApi();
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

/**
 * @typedef {object} BlockInfo
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 */

/**
 *
 * @type {_ChartFlowsBlocklist}
 * @private
 */
let _ChartFlowsBlocklist = class {
    constructor(element) {
        this._$element = element;
        this._blocks = []
    }

    /**
     *
     * @param {string} type
     * @param {BlockInfo} blockInfo
     */
    add(type, blockInfo) {
        let classDef = ChartFlows.getBlock(type);
        if (classDef) {
            let blockObj = new classDef();
            blockObj.info = blockInfo;
            let id = blockObj.init();
            this._blocks.push(blockObj)
        }
    }
}
let _ChartFlowsCanvas = class {
    constructor(element) {
        this._$element = element;
    }
}
ChartFlows.addSymbol('Symbol', class {

});
const _Symbol = ChartFlows.getSymbol('Symbol')
ChartFlows.addBlock('Decision', class extends _Block{

});
ChartFlows.addBlock('Process', class extends _Block {
    constructor() {
        super();
        console.log(this)
        this.template = `<div class="block-item"><div class="container-fluid"><div class="col-md-2">${this.info.icon}</div></div></div>`;
        console.log(this.template)
    }

});
ChartFlows.addBlock('Start', class extends _Block {

});
ChartFlows.addSymbol('Arrow', class extends _Symbol{

});