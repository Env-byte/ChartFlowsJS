/**
 *
 * @param {_ChartFlows.classes.canvas} canvas
 * @returns {{dropHandle: dropHandle}}
 */
_ChartFlows.utils.drop = function (canvas) {
    let $block, $helperEle;
    if (!canvas.element instanceof jQuery) {
        console.error('Canvas is not a jquery object')
    }

    return {
        /**
         *
         * @param event
         * @param ui
         */
        dropHandle: function (event, ui) {
            console.log('event', event)
            console.log('ui', ui)
            $block = ui.helper.clone()
            $block.appendTo(canvas.element)
            canvas.addBlockEntity($block.attr('id'))
            _ChartFlows.utils.eventDispatch.fire('ondrop', $block, $helperEle)
        }
    }
}

