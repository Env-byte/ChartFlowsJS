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
     * @param {function(_ChartFlows.utils.treeNode)} callback
     */
    traverse(callback) {
        const self = this;

        function goThrough(node) {
            callback(node);
            node.children.forEach((child) => {
                goThrough(child);
            });
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
     * @returns {boolean|FlatArray<*[], 1>[]}
     */
    displayLeaves(parentID) {
        const parentNode = typeof parentID === 'string' ? this.search(parentID) : parentID;
        let leafsRet = [];
        console.log(parentNode);

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
     * @param {_ChartFlows.classes.blockEntity} value
     * @param {[_ChartFlows.utils.treeNode]} children
     */
    constructor(value, children) {
        this.value = value;
        this.children = children;
        this.symbol = null;
        this.id = 'Node_' + _ChartFlows.utils.statics.genId()
    }
}