_ChartFlows.api = class {
    constructor() {
        this._blocks = {};
        this._symbols = {};
        this.loading = false;
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
     * @param {jQuery|boolean} blockList Pass false to not use the block list
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
                tree.push(node.serialize());
        })

        return {
            tree: tree
        };
    }

    load(object) {
        console.log('api - load object', object);

        if (!object.hasOwnProperty('tree')) {
            console.error("Object key 'tree' missing");
            return;
        }

        if (!Array.isArray(object.tree)) {
            console.error("Object key 'tree' is not an array");
            return;
        }

        let blockTemplates = this._blockList.blocks;
        let nodes = {}, node, parent, treeVal;
        let branchMap = {};
        let tree = this._canvas.blocks;
        if (tree instanceof _ChartFlows.utils.tree) {
            let node = tree.search(this.config.startNodeID)
            if (node instanceof _ChartFlows.utils.treeNode) {
                nodes[node.id] = node;
            }
        }

        for (let i = 0, iL = object.tree.length; i < iL; i++) {
            treeVal = object.tree[i];
            if (treeVal.block.id === 'Entity_StartNode') {
                //skip over start node if exists
                continue;
            }
            parent = [];
            if (!treeVal.block.hasOwnProperty('_instanceOf')) {
                console.error("Object key '_instanceOf' missing for block");
                return;
            }
            if (!blockTemplates.hasOwnProperty(treeVal.block._instanceOf)) {
                console.error("Cannot create a block from the template" + treeVal.block._instanceOf);
                return;
            }
            if (typeof treeVal.block.parentID === "string") {
                if (!nodes.hasOwnProperty(treeVal.block.parentID)) {
                    console.error("Cannot find parent node with id: " + treeVal.block.parentID);
                    return;
                }
                parent = nodes[treeVal.block.parentID];
            }

            node = this.addToCanvas(blockTemplates[treeVal.block._instanceOf], parent, {
                id: treeVal.block.id,
                data: treeVal.block.info.data,
            });
            console.log('api - node type', node.value);
            if (node.value instanceof _ChartFlows.classes.decisionEntity) {
                branchMap[treeVal.block.id] = treeVal.block.branches;
            }
            console.log('api - parent type', parent.value);
            if (parent.value instanceof _ChartFlows.classes.decisionEntity) {
                if (branchMap[parent.id]['true'] === treeVal.block.id) {
                    parent.value.setBranch(true, node.value);
                } else if (branchMap[parent.id]['false'] === treeVal.block.id) {
                    parent.value.setBranch(false, node.value);
                }
            }

            if (parent instanceof _ChartFlows.utils.treeNode) {
                setTimeout(() => {
                    parent.repositionChildren()
                    parent.rebuildNodeLinks();
                }, 150)
            }

            nodes[node.id] = node;
        }

        // traverse all nodes and set data

        this.canvas.blocks.traverse(node => {
            // get this nodes parent
            // check if the symbols is linked to this node
            for (let i = 0, iL = object.tree.length; i < iL; i++) {
                let treeVal = object.tree[i];

                if (treeVal.block.id !== node.id) {
                    continue;
                }

                /* for (let i = 0, iL = treeVal['symbols'].length; i < iL; i++) {
                     let symbol = treeVal['symbols'][i];

                     for (let x = 0, xL = node.symbols.length; x < xL; x++) {
                         //console.log('linkedTo', node.symbols[x].linkedTo === symbol.linkedTo);
                         if (node.symbols[x].linkedTo === symbol.linkedTo) {
                             node.symbols[x].id = symbol.id;
                             for (let n = 0, nL = symbol.data.length; n < nL; n++) {
                                 node.symbols[x].data.add(symbol.data[n].name, symbol.data[n].value);
                             }
                         }

                         //console.log('symbol', symbol);
                         // console.log('parentNode.symbols[i]', node.symbols[i]);
                     }
             }*/
            }
        })

    }

    /**
     *
     * @param {_ChartFlows.classes._Block} instanceOf
     * @param {jQuery[] | _ChartFlows.utils.treeNode} parent
     * @param {{}} options
     */
    addToCanvas(instanceOf, parent, options) {
        this.loading = true;

        let $template = instanceOf.$.clone().detach();
        this._canvas.element.append($template);
        $template.removeClass('can-drop')
        $template.css('position', 'absolute')

        let node = this._canvas.addBlockEntity($template, instanceOf, parent);
        if (node) {
            let originalID = node.id;
            if (options.hasOwnProperty('id')) {
                // need to get parent and change the linkedTo id on the arrow symbol
                node.id = options.id;
                node.value.id = options.id;
            }
            if (options.hasOwnProperty('data') && options.data.length) {
                for (let i = 0, iL = options.data.length; i < iL; i++) {
                    node.value.data.add(options.data[i].name, options.data[i].value);
                }
            }

            //console.log('originalID', originalID)
            //console.log('node.id', node.id)
            if (originalID !== node.id) {
                // change the id of the symbol
                let parentNode = this.canvas.blocks.getParent(node.id);
                if (parentNode) {
                    for (let i = 0, iL = parentNode.symbols.length; i < iL; i++) {
                        if (parentNode.symbols[i].linkedTo === originalID) {
                            parentNode.symbols[i].linkedTo = node.id;
                        }
                    }
                }
            }
        }


        this.loading = false;
        return node;
    }
}