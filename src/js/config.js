let _ChartFlows = {
    config: undefined,
    api: undefined,
    utils: {},
    classes: {},
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
        this._snapTolerance = 30;
        this._blockSpacing = 80;
        this._disableDrag = false;
        this.showStart = true;
        //give start node a static id
        this.startNodeID = 'Entity_StartNode';
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

    get disableDrag() {
        return this._disableDrag;
    }

    set disableDrag(value) {
        this._disableDrag = value;
    }

    get blockSpacing() {
        return this._blockSpacing;
    }

    set blockSpacing(value) {
        this._blockSpacing = value;
    }

}