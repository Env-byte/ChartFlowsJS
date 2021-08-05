/**
 *
 * @param {string} rootID css selector to get the root of the block
 * @returns {{endHandle: endHandle, startHandle: startHandle}}
 */
_ChartFlows.utils.drag = function (rootID) {
    let $originalEle, $helperEle, visibleIndicator;
    const canvas = _ChartFlows.utils.statics.getApi().canvas;

    /**
     *
     * @param originalEle
     * @returns {boolean|jQuery}
     */
    function getEle(originalEle) {
        let res = originalEle.closest('#' + rootID);
        if (res.length === 0) {
            if (originalEle.attr('id') !== rootID) {
                console.error('Cant find the root of the block using the id: ', rootID);
                return false;
            }
        } else {
            originalEle = res;
        }
        return originalEle
    }

    return {

        /**
         *
         * @param event
         * @param ui
         */
        startHandle: (event, ui) => {
            $originalEle = getEle($(event.target));
            if ($originalEle) {
                $helperEle = ui.helper;
                $helperEle.attr('data-instance', $originalEle.attr('id'));

                if ($originalEle.hasClass('can-drop')) {
                    // new block dragged on to canvas

                } else {
                    // block entity being dragged around on canvas

                }

                _ChartFlows.utils.eventDispatch.fire('dragstart', $originalEle, $helperEle)
            }
        },
        endHandle: function () {

            // block entity being dragged around on canvas
            if (!$originalEle.hasClass('can-drop')) {
                let blockEntity = _ChartFlows.utils.statics.getBlockEntityNode($originalEle).value;
                let snapped = _ChartFlows.utils.statics.getSnappedElements($originalEle);
                canvas.changeBlockEntityParent(blockEntity, snapped)
            }

            if (visibleIndicator) {
                visibleIndicator.css('visibility', 'hidden');
            }

            _ChartFlows.utils.eventDispatch.fire('dragend')
        },
        moveBlock: function () {
            let snapped = _ChartFlows.utils.statics.getSnappedElements($originalEle, $helperEle);
            if (snapped && snapped.length > 0) {
                if (visibleIndicator !== snapped[0]) {
                    if (visibleIndicator) {
                        visibleIndicator.css('visibility', 'hidden');
                    }
                    visibleIndicator = snapped[0];
                    visibleIndicator.css('visibility', 'visible');
                }
            } else {
                if (visibleIndicator) {
                    visibleIndicator.css('visibility', 'hidden');
                }
            }

            _ChartFlows.utils.eventDispatch.fire('dragmove', $originalEle, $helperEle)
        },
        updateRootID: (id) => {
            rootID = id;
        }
    }
}

