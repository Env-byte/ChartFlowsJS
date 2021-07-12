let _ChartFlows = {
    config: undefined,
    api: undefined,
    utils: {},
    classes: {}
}
_ChartFlows.config = class {
    constructor() {
        this._debug = 0;
        this._container = $();
        this._blockList = $();
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

    addTemplate(key, template) {
        this._templates[key] = template;
    }

    getTemplate(key) {
        if (this._templates.hasOwnProperty(key)) {
            return this._templates[key];
        } else {
            console.error('Template ' + key + ' does not exist');
            return '';
        }
    }
}