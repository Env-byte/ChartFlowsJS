/**
 *
 * @typedef {Function} _Block
 * @property {BlockInfo} info
 * @property {string} template
 * @property {string} id
 * @property {function} generateBlock
 */

/**
 *
 * @typedef {Function} _Symbol
 * @property {string} id
 */

/**
 * @typedef {object} BlockInfo
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 */
let _ChartFlowsConfig = class {

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

ChartFlows.config.addTemplate('Process', `<div data-id="<?% id %?>" class="block-item process">
    <div class="container-fluid">
        <div class="col-md-2"><?% info.icon %?></div>
        <div class="col-md-10">
            <p><?% info.name %?></p>
            <p><?% info.description %?></p>
        </div>
    </div>
</div>`);
let _IdsInUse = []

class StaticHelpers {

    static _genId() {
        let result, characters, charactersLength;

        do {
            result = '';
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            charactersLength = characters.length;
            for (let i = 0; i < 12; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            // check if id is currently in use
        } while (_IdsInUse.indexOf(result) !== -1);

        _IdsInUse.push(result);
        return result;
    }

    static releaseId(result) {
        let index = _IdsInUse.indexOf(result)
        if (index !== -1) {
            _IdsInUse.splice(index, 1);
        }
    }
}
const _TemplateHandler = function () {

    let expression = new RegExp(/(<\?%[\s]*)([A-z0-9.]+)([\s]*%\?>)/g)

    /**
     *
     * @param template
     * @returns {Object}
     */
    function getTags(template) {

        let tags = {};
        let results;

        do {
            results = expression.exec(template)
            // second group in reg ex is the tag
            if (results && results.hasOwnProperty(2)) {
                tags[results[0]] = (results[2]);
            }
        } while (results)

        return tags;
    }

    function createMap(tags, object) {
        let map = {};
        let obj, smallTag, parts, value;
        for (let fullTag in tags) {
            if (tags.hasOwnProperty(fullTag)) {
                smallTag = tags[fullTag];

                parts = smallTag.split('.');
                value = '';
                obj = object;

                for (let x = 0, xL = parts.length; x < xL; x++) {
                    if (obj.hasOwnProperty(parts[x])) {
                        obj = obj[parts[x]];
                    }
                }

                if (typeof obj !== "object") {
                    value = obj;
                }

                map[fullTag] = value;
            }
        }
        return map;
    }

    function replaceTags(map, template) {
        let html = template;
        for (let tag in map) {
            if (map.hasOwnProperty(tag)) {
                html = html.replace(tag, map[tag]);
            }
        }
        return html;
    }

    return {
        parse: (object) => {
            let html = '';
            if (ChartFlows.config.debug === 1) {
                console.log('Parse', object)
            }

            if (object.hasOwnProperty('template')) {
                let tags = getTags(object.template);
                if (ChartFlows.config.debug === 1) {
                    console.log('Tags', tags)
                }
                if (Object.keys(tags).length > 0) {
                    html = replaceTags(createMap(tags, object), object.template);
                    if (ChartFlows.config.debug === 1) {
                        console.log('Generated HTML', html)
                    }
                } else {
                    if (ChartFlows.config.debug === 1) {
                        console.log('No tags found')
                    }
                }
            } else {
                console.error('Object does not have property `template`')
            }

            return html;
        }
    }
}

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
            /**
             * @type _Block
             */
            let blockObj = new classDef();
            blockObj.info = blockInfo;
            let html = blockObj.generateBlock();

            if (ChartFlows.config.debug === 1) {
                console.log('Created Block', blockObj);
            }

            this._blocks.push(blockObj)
            this._$element.append(html);
        }
    }
}
let _ChartFlowsCanvas = class {
    constructor(element) {
        this._$element = element;
    }
}
ChartFlows.addSymbol('Symbol', class {
    constructor() {
        this.id = StaticHelpers._genId()
    }

});

/**
 *
 * @type {_Symbol}
 * @private
 */
const _Symbol = ChartFlows.getSymbol('Symbol')
ChartFlows.addBlock('Decision', class extends _Block {
    constructor() {
        super();
        this.type = 'Decision';
    }
});
ChartFlows.addBlock('Process', class extends _Block {
    constructor() {
        super();
        this.type = 'Process';
    }
});
ChartFlows.addBlock('Start', class extends _Block {
    constructor() {
        super();
        this.type = 'Start';
    }
});
ChartFlows.addSymbol('Arrow', class extends _Symbol{

});