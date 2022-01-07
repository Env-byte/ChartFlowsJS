/**
 *
 * @returns {{dropHandle: dropHandle}}
 */
_ChartFlows.utils.drop = function () {
    let $block;
    return {
        /**
         *
         * @param event
         * @param ui
         */
        dropHandle: function (event, ui) {
            if (ChartFlows.config.debug === 1) {
                console.log('Drop - dropHandle');
            }

            let canvas = _ChartFlows.utils.statics.getApi().canvas;

            $block = ui.helper.clone();
            $block.appendTo(canvas.element);

            //get the blocks offset to the top of the screen
            let y = $block[0].offsetTop;

            //get the canvas offset left to the window
            let x = canvas.element[0].getBoundingClientRect().left;

            //minus the blocks offset from the canvas offset to the window plus 31
            let left = ui.offset.left - x + 31;

            $block.css('left', left).css('top', y)

            if ($block.hasClass('can-drop')) {
                let blockObj = _ChartFlows.utils.statics.getBlock($block);
                if (blockObj instanceof _ChartFlows.classes._Block) {
                    // new block dragged on to canvas
                    let snapped = _ChartFlows.utils.statics.getSnappedElements(blockObj.$, $block);
                    if (ChartFlows.config.debug === 1) {
                        console.log('Drop - snapped', snapped);
                    }
                    if (snapped && snapped.length && snapped.length > 0) {
                        let parentNode = _ChartFlows.utils.statics.getApi().canvas.getBlockEntityNode(snapped[0]);
                        let result = _ChartFlows.utils.eventDispatch.fire('drop', event, blockObj, parentNode);
                        if (ChartFlows.config.debug === 1) {
                            console.log('Drop - drop result', result);
                        }
                        if (result === false) {
                            $block.remove();
                            return;
                        }
                        canvas.addBlockEntity($block, blockObj, parentNode, (blockEntity) => {
                            if (parentNode.value instanceof _ChartFlows.classes.decisionEntity) {
                                if ($(snapped[0]).hasClass('true') && parentNode.value.branches['true'] === null) {
                                    parentNode.value.setBranch(true, blockEntity);
                                } else if (parentNode.value.branches['false'] === null) {
                                    parentNode.value.setBranch(false, blockEntity);
                                } else {
                                    $block.remove();
                                    _ChartFlows.utils.eventDispatch.fire('failedtosnapblock', 'Cannot add more than two blocks')
                                    return false;
                                }
                            }
                        });
                    } else {
                        $block.remove();
                    }
                }
            }
        }
    }
}