/**
 *
 * @type {{genId: (function(): string), releaseId(string): this, _IdsInUse: *[]}}
 */
_ChartFlows.utils.statics = {
    _IdsInUse: [],
    /**
     *
     * @returns {string}
     */
    genId: function () {
        let result, characters, charactersLength;

        do {
            result = '';
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            charactersLength = characters.length;
            for (let i = 0; i < 12; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            // check if id is currently in use
        } while (this._IdsInUse.indexOf(result) !== -1);

        this._IdsInUse.push(result);
        return result;
    },
    /**
     *
     * @param {string} result
     */
    releaseId(result) {
        let index = this._IdsInUse.indexOf(result)
        if (index !== -1) {
            this._IdsInUse.splice(index, 1);
        }
        return this;
    },

    /**
     * this is a block that isn't on the canvas
     * @param {jQuery} $block
     * @returns {boolean|_Block}
     */
    getBlock($block) {
        let blockList = ChartFlows.blockList;
        if (blockList instanceof _ChartFlows.classes.blockList) {
            let blockID = $block.data('instance');
            return blockList.getBlock(blockID)
        }
    },

    /**
     * this is a block that is on the canvas
     * @param {jQuery} $block
     * @returns {_ChartFlows.utils.treeNode}
     */
    getBlockEntity($block) {
        let canvas = ChartFlows.canvas;
        return canvas.getBlockEntity($block);
    },

    /**
     *
     * @param $ele The jQuery element that is draggable
     * @return {boolean|jQuery}
     */
    getSnappedElements($ele) {
        let data = $ele.draggable("instance");
        console.log('draggable', $ele);
        console.log('data', data);
        if (data) {
            /* Pull out only the snap targets that are "snapping": */
            return $.map(data.snapElements, function (element) {
                return element.snapping ? $(element.item) : null;
            })

        }
        return false;
    }
}


