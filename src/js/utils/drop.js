/**
 *
 * @param {_ChartFlows.classes.canvas} canvas
 * @returns {{dropHandle: dropHandle}}
 */
_ChartFlows.utils.drop = function (canvas) {
    let $block;
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
            $block = ui.helper.clone();
            $block.appendTo(canvas.element);

            //get the blocks offset to the top of the screen
            let y = $block[0].offsetTop;

            //get the canvas offset left to the window
            let x = canvas.element[0].getBoundingClientRect().left;

            //minus the blocks offset from the canvas offset to the window plus 31
            let left = ui.offset.left - x + 31;

            //let $body = $('body');
            // _ChartFlows.utils.draw.dot(left, y, 10, 'purple', canvas.element);
            // _ChartFlows.utils.draw.dot(ui.offset.left, ui.offset.top, 10, 'blue', $body);

            $block.css('left', left).css('top', y)
            //console.log('left', left, 'top', y);
            //console.log('ui', ui);
            //console.log('event', event);

            _ChartFlows.utils.eventDispatch.fire('ondrop', $block)
            canvas.addBlockEntity($block);
        }
    }
}

