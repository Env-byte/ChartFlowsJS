_ChartFlows.utils.eventDispatch = {
    availableEvents: [
        /*
        * called when done initializing
        * @param {_ChartFlows.api } api
        */
        'initialized',

        /*
        * Called on block drag start
        * @param {jQuery} helperEle
        * @param {jQuery} originalEle
        */
        'dragstart', //done

        /*
        * Called on block drag end
        * @param {jQuery} helperEle
        * @param {jQuery} originalEle
        */
        'dragend', //done

        /*
         * Called when the block moves
         * @param {jQuery} helperEle
         * @param {jQuery} originalEle
         */
        'dragmove', //done

        /*
         * called when a new block is dropped onto the canvas
         * @param {eventData} event
         * @param {_Block} block
         * @param {_ChartFlows.utils.treeNode|false} parentNode
         * return false to prevent drop
         */
        'drop', //done

        /*
         * called on block click
         * @param {eventData} event - the normal event data from a click event
         * @param {_ChartFlows.classes.blockEntity} block
         */
        'blockclick',

        //done
        /* called on block list click
        * @param {eventData} event - the normal event data from a click event
        * @param {_ChartFlows.classes.block} blockListItem
        */
        'blockListClick', //done

        /*
         * called after the block gets re-parented
         * @param {_ChartFlows.classes.blockEntity} block
         * @param {_ChartFlows.classes.blockEntity|null} parent
         */
        'blockreparent', //done

        /*
         * Before the block gets parented
         * Does not run during load
         * return false to prevent snap
         * @param {_ChartFlows.classes.blockEntity} block
         * @param {_ChartFlows.utils.treeNode|null} parent
         *
         * return false to prevent
         */
        'blocksnap', //done

        /*
         * After the block gets parented
         * Does not run during load
         * return false to prevent snap
         * @param {_ChartFlows.classes.blockEntity} block
         * @param {_ChartFlows.utils.treeNode|null} parent
         *
         */
        'afterblocksnap', //done

        /*
         *  when a new block entity is created, immediately after its _init() function is called
         *
         * return false to prevent snap
         * @param {_ChartFlows.classes.blockEntity} block
         * @param {_ChartFlows.classes._Block} instanceOf
         *
         */
        'createdblockentity', //done

        /*
         * when the arrows links are built
         * @param {_ChartFlows.utils.treeNode } node
         *
         */
        'buildlinks', //done

        /*
        * when a block fails to snap
        * @param {string} message
        */
        'failedtosnapblock',

        /*
        * after a block has been replaced
        * @param {_ChartFlows.utils.treeNode} oldNode
        * @param {_ChartFlows.utils.treeNode} parentNode
        */
        'afterreplace'
    ],

    /**
     *
     * @param {string} event
     * @param params
     * @return null|boolean
     */
    fire: function (event, ...params) {
        if (ChartFlows.events.hasOwnProperty(event)) {
            if (ChartFlows.events[event]) {
                let result
                for (let i = 0, iL = ChartFlows.events[event].length; i < iL; i++) {
                    if (typeof ChartFlows.events[event][i] === "function") {
                        result = ChartFlows.events[event][i](...params);
                    }
                }
                // return the result of the last event
                // ignore the result of the events fired before it
                // only applies if multiple callbacks bound to one event
                return result;
            }
        }
    }
}