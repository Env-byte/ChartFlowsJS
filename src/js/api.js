_ChartFlows.api = class {
    constructor() {
        this._blocks = {};
        this._symbols = {};
        this._version = 1.0;
        this._config = new _ChartFlows.config();
        this._canvas = null;
        this._blockList = null;
        this._events = {};

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
     */
    init(container, blockList) {
        if (this.config.debug === 1) {
            console.log('ChartFlows ' + this._version + ' debugging enabled');
            console.log('init ChartFlows');
        }

        this._canvas = new _ChartFlows.classes.canvas(container, this);
        this._blockList = new _ChartFlows.classes.blockList(blockList);

        _ChartFlows.utils.eventDispatch.fire('initialized', this);
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
     * @returns {{}}
     */
    get events() {
        return this._events;
    }

    on(event, handler) {
        let eventHelper = _ChartFlows.utils.eventDispatch;
        if (eventHelper.availableEvents.indexOf(event) !== -1) {
            if (!this._events[event]) {
                this._events[event] = [];
            }
            this._events[event].push(handler);
        }
    }

    save() {
        //save tree
        let tree = [];
        this.canvas.blocks.traverse((node) => {
            if (node)
                tree.push(node.value.serialize());
        })

        return {
            tree: tree
        };
    }

    load(object) {
        console.log('Started Load')
        if (!object.hasOwnProperty('tree')) {
            console.error("Object key 'tree' missing");
            return;
        }

        if (!Array.isArray(object.tree)) {
            console.error("Object key 'tree' is not an array");
            return;
        }

        //todo clear canvas

        let blockTemplates = this._blockList.blocks;
        let nodes = {}, node, parent, treeVal, $template;
        let remapIDs = {}

        for (let i = 0, iL = object.tree.length; i < iL; i++) {
            treeVal = object.tree[i];
            parent = [];

            if (!treeVal.hasOwnProperty('_instanceOf')) {
                console.error("Object key '_instanceOf' missing for block");
                return;
            }
            if (!blockTemplates.hasOwnProperty(treeVal._instanceOf)) {
                console.error("Cannot create a block from the template" + treeVal._instanceOf);
                return;
            }
            if (typeof treeVal.parentID === "string") {
                if (!nodes.hasOwnProperty(treeVal.parentID)) {
                    console.error("Cannot find parent node with id: " + treeVal.parentID);
                    return;
                }

                parent = nodes[treeVal.parentID];
            }

            $template = blockTemplates[treeVal._instanceOf].$.clone().detach();
            this._canvas.element.append($template);
            $template.removeClass('can-drop')
            $template.css('position', 'absolute')

            node = this._canvas.addBlockEntity($template, blockTemplates[treeVal._instanceOf], parent);
            if (node) {
                node.value.setPos(treeVal.left, treeVal.top);
                remapIDs[node.id] = treeVal.id;
                //set the node id and the block entity id
                node.id = treeVal.id;
                node.value.id = treeVal.id;
                nodes[node.id] = node;
            }

            if (parent instanceof _ChartFlows.utils.treeNode) {
                parent.repositionChildren()
                parent.rebuildNodeLinks();
            }
        }

        this.canvas.blocks.traverse(node => {
            if (node) {
                if (remapIDs.hasOwnProperty(node.value.parentID)) {
                    node.value.parentID = remapIDs[node.value.parentID];
                }
            }
        })

        console.log('Finished Load')
    }
}