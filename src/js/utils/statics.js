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
    getBlockEntityNode($block) {
        let canvas = ChartFlows.canvas;
        return canvas.getBlockEntityNode($block);
    },

    /**
     *
     * @param $ele The jQuery element that is draggable
     * @param $helper The jQuery element that is draggable
     * @return {jQuery[]}
     */
    getSnappedElements($ele, $helper) {
        let data = $ele.draggable("instance");
        let eleOffset
        if ($helper) {
            eleOffset = this.offset($helper[0]);
        } else {
            eleOffset = this.offset($ele[0]);
        }

        let width = $ele.width();

        // Work out the x min and x max for the snapping
        let leftBound = eleOffset.left + ChartFlows.config.snapTolerance;
        let rightBound = eleOffset.left + width + ChartFlows.config.snapTolerance;

        if (data) {
            /* Pull out only the snap targets that are "snapping": */
            return $.map(data.snapElements, (element) => {
                if (element.snapping) {
                    if ($(element.item).closest('.block-item').attr('id') !== $ele.attr('id')) {
                        let itemOffset = this.offset(element.item);
                        if (itemOffset.left > leftBound && itemOffset.left < rightBound) {
                            return $(element.item)
                        }
                    }
                }
            });
        }
        return [];
    },

    /**
     *
     * @return {_ChartFlows.api }
     */
    getApi() {
        return ChartFlows
    },

    /**
     *
     * @param el
     * @return {{top: number, left: number}}
     */
    offset(el) {
        let rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
    }
}


