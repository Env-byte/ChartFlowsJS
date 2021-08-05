_ChartFlows.utils.tree = class {
    /**
     *
     * @param {_ChartFlows.utils.treeNode|null} root
     */
    constructor(root) {
        this._root = root || null;
    }

    /**
     *
     * @param {function(_ChartFlows.utils.treeNode|boolean)} callback
     */
    traverse(callback) {
        function goThrough(node) {
            if (node instanceof _ChartFlows.utils.treeNode) {
                callback(node);
                node.children.forEach((child) => {
                    goThrough(child);
                });
            } else {
                callback(false);
            }
        }

        goThrough(this._root);
    }

    /**
     *
     * @param {_ChartFlows.utils.treeNode} value
     * @param {string} parentId
     */
    addNode(value, parentId) {
        if (this._root === null) {
            this._root = value;
            return;
        }

        this.traverse((node) => {

            if (node.id === parentId) {
                node.children.push(value);
            }
        });
    }

    /**
     *
     * @param {string} id
     */
    removeNode(id) {
        this.traverse((node) => {
            node.children.forEach((childNode, index) => {
                if (childNode.id === id) {
                    node.children.splice(index, 1);
                }
            });
        })
    }

    /**
     *
     * @param {string} id
     * @returns {boolean|_ChartFlows.utils.treeNode }
     */
    search(id) {
        let returnNode = false;
        this.traverse((node) => {
            if (node.id === id) {
                returnNode = node;
            }
        });
        return returnNode;
    }

    /**
     *
     * @param parentID
     * @returns {boolean|FlatArray<*[]>[]}
     */
    displayLeaves(parentID) {
        const parentNode = typeof parentID === 'string' ? this.search(parentID) : parentID;
        let leafsRet = [];

        if (parentNode instanceof _ChartFlows.utils.treeNode) {
            if (parentNode.children) {
                if (!parentNode.children.length && parentNode.children.length > 0) {
                    parentNode.children.forEach((child) => {
                        leafsRet.push(this.displayLeaves(child));
                    });
                    return leafsRet.flat();
                }
            }
        } else {
            console.error('Invalid parameter parentID: ' + typeof parentID);
        }
        return false;
    }

    /**
     *
     * @returns {null|_ChartFlows.utils.treeNode}
     */
    get root() {
        return this._root;
    }
}

_ChartFlows.utils.treeNode = class {

    /**
     *
     * @param {_ChartFlows.classes.blockEntity} blockEntity
     * @param {_ChartFlows.utils.treeNode[]} children
     */
    constructor(blockEntity, children) {
        this.value = blockEntity;
        this.children = children;
        this._symbols = {};
        /**
         *
         * @type {string}
         */
        this.id = blockEntity.id
    }

    repositionChildren() {

        let child;

        let top = this.value.$.height() + _ChartFlows.utils.statics.getApi().config.blockSpacing;
        if (this.children.length === 0) {
            return;
        }
        if (this.children.length === 1) {
            child = this.children[0];
            child.value.setPos(0 + 'px', top + 'px');
        } else {

            //set start to middle of the parent node
            let leftStart = this.value.$.width() / 2;
            //this assumes all blocks are the same width
            leftStart = leftStart - ((this.value.$.width()) * (this.children.length * .5)) - ((this.children.length - 1) * 10);

            for (let i = 0, iL = this.children.length; i < iL; i++) {
                child = this.children[i];

                // 20 margin between each one
                let left = leftStart + (i * (this.value.$.width() + 20));

                child.value.setPos(left + 'px', top + 'px');
            }
        }
    }

    rebuildNodeLinks() {
        //the that the arrows should branch from
        let child, arrow;
        let classDef = ChartFlows.getSymbol('Arrow');

        for (let key in this._symbols) {
            if (this._symbols.hasOwnProperty(key)) {
                this._symbols[key].remove();
            }
        }
        this._symbols = [];

        if (this.children.length === 0) {
            return;
        }

        for (let i = 0, iL = this.children.length; i < iL; i++) {
            arrow = new classDef(this);

            child = this.children[i];
            //for each child build arrow
            arrow.render(this.value, child.value)

            this._symbols[arrow.id] = (arrow);
        }
    }

    /**
     *
     * @return {{({string}):(_Symbol)}}
     */
    get symbols() {
        return this._symbols;
    }
}