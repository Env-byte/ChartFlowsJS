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