let _ChartFlows = {
    config: undefined,
    api: undefined,
    utils: {},
    classes: {}
}
_ChartFlows.config = class {
    constructor() {
        this._debug = 0;
        /**
         *
         * @type {Object.<string, string>}
         * @private
         */
        this._templates = {};
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