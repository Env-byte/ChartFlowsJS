let _ChartFlows = {
    config: undefined,
    api: undefined,
    utils: {},
    classes: {}
}
_ChartFlows.config = class {
    get blockSpacing() {
        return this._blockSpacing;
    }

    set blockSpacing(value) {
        this._blockSpacing = value;
    }

    constructor() {
        this._debug = 0;
        /**
         *
         * @type {Object.<string, string>}
         * @private
         */
        this._templates = {};
        this._snapTolerance = 30;
        this._blockSpacing = 80;
        this.showStart = true;
    }

    /**
     *
     * @param {number} value
     */
    set snapTolerance(value) {
        this._snapTolerance = value;
    }

    /**
     *
     * @return {number}
     */
    get snapTolerance() {
        return this._snapTolerance;
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
     * @param {string} key
     * @param {string} template
     */
    addTemplate(key, template) {
        this._templates[key] = template;
    }

    /**
     *
     * @param key
     * @returns {string}
     */
    getTemplate(key) {
        if (this._templates.hasOwnProperty(key)) {
            return this._templates[key];
        } else {
            console.error('Template ' + key + ' does not exist');
            return '';
        }
    }
}