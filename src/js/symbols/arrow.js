$('body').append(
    '<svg id="svgArrow" preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
    '<marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">' +
    '<path d="M0,0 L0,6 L4,3 z" class="arrowHead"/>' +
    '</marker>' +
    '</defs>' +
    '</svg>' +
    '<svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<marker id="arrowFalse" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">' +
    '<path fill="red" stroke="red" d="M0,0 L0,6 L4,3 z"/>' +
    '</marker>' +
    '</svg>' +
    '<svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<marker id="arrowTrue" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">' +
    '<path fill="green" stroke="green" d="M0,0 L0,6 L4,3 z"/>' +
    '</marker>' +
    '</svg>'
);
_ChartFlows.classes._Arrow = class extends _ChartFlows.classes._Symbol {

    constructor(parent) {
        super(parent);
    }

    /**
     *
     * @param {_ChartFlows.classes.blockEntity} startBlock
     * @param {_ChartFlows.classes.blockEntity} endBlock
     */
    render(startBlock, endBlock) {

        if (startBlock instanceof _ChartFlows.classes.decisionEntity) {
            this._renderDecision(startBlock, endBlock)
            return;
        }

        let statics = _ChartFlows.utils.statics;

        let endBlockLeft = endBlock.pos.left;

        let x;
        if (typeof endBlockLeft === "string") {
            endBlockLeft = endBlockLeft.replace('px', '');
            x = parseInt(endBlockLeft);
        }

        if (typeof x === "boolean") {
            return;
        }

        let y = statics.getApi().config.blockSpacing;
        let startMidPoint = startBlock.$.width() / 2 - 20;
        let html, left, line1 = '', line2 = '', line3 = '', distance = 20;

        //  x = x + 10;

        let top = (startBlock.$.height());

        //first block attached to start has an x of -10
        if (x === -10) {
            x = 0;
        }
        if (x === 0) {
            // arrow is going straight down
            line1 = '<line x1="20" y1="0" x2="20" y2="' + (y - 10) + '" class="arrowLine marker" marker-end="url(#arrow)"/>'
            left = startMidPoint;
        } else if (x > 0) {
            x = x - 10;
            // arrow is going right
            let right = x + (endBlock.$.width() / 2);
            distance = right - startMidPoint + 20;

            line1 = '<line x1="20" y1="0" x2="20" y2="' + (y / 2) + '" class="arrowLine"/>'
            line2 = '<line x1="20" y1="' + (y / 2) + '" x2="' + distance + '" y2="' + (y / 2) + '" class="arrowLine"/>'
            line3 = '<line x1="' + distance + '" y1="' + (y / 2) + '" x2="' + distance + '" y2="' + (y - 10) + '" class="arrowLine marker" marker-end="url(#arrow)"/>';

            left = startMidPoint;
        } else {
            // arrow is going left
            left = x + (endBlock.$.width() / 2);

            //+ 20 because of element padding, else it wont be in the middle of the end block
            distance = startMidPoint - left + 20;

            line1 = '<line x1="20" y1="' + (y - 10) + '" x2="20" y2="' + (y / 2) + '" style="transform:rotate(180deg) translate(-40px, -110px)" class="arrowLine marker" marker-end="url(#arrow)"/>'
            line2 = '<line x1="20" y1="' + (y / 2) + '" x2="' + distance + '" y2="' + (y / 2) + '" class="arrowLine"/>'
            line3 = '<line x1="' + distance + '" y1="' + (y / 2) + '" x2="' + distance + '" y2="' + 0 + '" class="arrowLine"/>';
        }

        html = '<div id="' + this['_id'] + '" class="arrow-block">' +
            '<svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            ' ' + (line1) + ' ' +
            ' ' + (line2) + ' ' +
            ' ' + (line3) + ' ' +
            '</svg>' +
            '</div>';

        let $node = $(html);
        startBlock.$.append($node);

        $node
            .css('left', left)
            .css('top', top)
            .css('height', (y) + 'px')
            .css('width', (distance + 20) + 'px');

        this._$ = $node;

        endBlock.parentArrow = this._id;
    }

    /**
     *
     * @param {_ChartFlows.classes.blockEntity} startBlock
     * @param {_ChartFlows.classes.blockEntity} endBlock
     */
    _renderDecision(startBlock, endBlock) {
        let statics = _ChartFlows.utils.statics;
        let line1, line2, line3, html, distance = 0;
        let y = statics.getApi().config.blockSpacing;
        let startpoint;
        let margin = 0;

        let x;
        let endBlockLeft = endBlock.pos.left;
        if (typeof endBlockLeft === "string") {
            endBlockLeft = endBlockLeft.replace('px', '');
            x = parseInt(endBlockLeft);
        }
        if (startBlock.branches['true'] && endBlock.id === startBlock.branches['true'].id) {
            startpoint = 0;
            distance = ((startBlock.$.width() / 2) + 20);
            if (x === 0) {
                margin = -25;
                //we need to go right as there is only 1 block in the centre
                line1 = '<line x1="20" y1="0" x2="20" y2="' + (startBlock.$.height() / 2 + (y / 2)) + '" class="arrowLine"/>'
                line2 = '<line x1="20" y1="' + (startBlock.$.height() / 2 + (y / 2)) + '" x2="' + distance + '" y2="' + (startBlock.$.height() / 2 + (y / 2)) + '" class="arrowLine"/>'
                line3 = '<line x1="' + distance + '" y1="' + (startBlock.$.height() / 2 + (y / 2)) + '" x2="' + distance + '" y2="' + ((startBlock.$.height() / 2 + (y)) - 10) + '" class="arrowLine marker" marker-end="url(#arrow)"/>';
            } else {
                distance += 20;
                startpoint = startpoint - distance;
                line1 = '<line x1="' + (distance) + '" y1="0" x2="' + (distance) + '" y2="' + (startBlock.$.height() / 2 + (y / 2)) + '" class="arrowLine"/>'
                line2 = '<line x1="' + (distance) + '" y1="' + (startBlock.$.height() / 2 + (y / 2)) + '" x2="20" y2="' + (startBlock.$.height() / 2 + (y / 2)) + '" class="arrowLine"/>'
                line3 = '<line x1="20" y1="' + (startBlock.$.height() / 2 + (y / 2)) + '" x2="20" y2="' + ((startBlock.$.height() / 2 + (y)) - 10) + '" class="arrowLine marker" marker-end="url(#arrow)"/>';
            }

        } else if (startBlock.branches['false'] && endBlock.id === startBlock.branches['false'].id) {
            startpoint = startBlock.$.width();
            distance = ((startBlock.$.width() / 2) + 20);
            if (x === 0) {
                startpoint = startpoint - distance;
                //we need to go right as there is only 1 block in the centre
                line1 = '<line x1="'+distance+'" y1="0" x2="'+distance+'" y2="' + (startBlock.$.height() / 2 + (y / 2)) + '" class="arrowLine"/>'
                line2 = '<line x1="'+distance+'" y1="' + (startBlock.$.height() / 2 + (y / 2)) + '" x2="20" y2="' + (startBlock.$.height() / 2 + (y / 2)) + '" class="arrowLine"/>'
                line3 = '<line x1="20" y1="' + (startBlock.$.height() / 2 + (y / 2)) + '" x2="20" y2="' + ((startBlock.$.height() / 2 + (y)) - 10) + '" class="arrowLine marker" marker-end="url(#arrow)"/>';

            } else {
                distance += 20;
                margin = -20;
                //we need to go right as there is only 1 block in the centre
                line1 = '<line x1="20" y1="0" x2="20" y2="' + (startBlock.$.height() / 2 + (y / 2)) + '" class="arrowLine"/>'
                line2 = '<line x1="20" y1="' + (startBlock.$.height() / 2 + (y / 2)) + '" x2="' + distance + '" y2="' + (startBlock.$.height() / 2 + (y / 2)) + '" class="arrowLine"/>'
                line3 = '<line x1="' + distance + '" y1="' + (startBlock.$.height() / 2 + (y / 2)) + '" x2="' + distance + '" y2="' + ((startBlock.$.height() / 2 + (y)) - 10) + '" class="arrowLine marker" marker-end="url(#arrow)"/>';
            }
            console.log('x', x);
            console.log(distance);
        } else {
            console.error('error endblock id does not match either condition ids')
            return;
        }

        html = '<div id="' + this['_id'] + '" class="arrow-block">' +
            '<svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            ' ' + (line1) + ' ' +
            ' ' + (line2) + ' ' +
            ' ' + (line3) + ' ' +
            '</svg>' +
            '</div>';

        let $node = $(html);
        startBlock.$.append($node);

        $node
            .css('left', startpoint)
            .css('top', ((startBlock.$.height() / 2)) + 'px')
            .css('height', ((startBlock.$.height() / 2 + (y)) + 20) + 'px')
            .css('width', (distance + 20) + 'px')
            .css('margin-left', margin + 'px');

        this._$ = $node;
        endBlock.parentArrow = this._id;

    }
}
ChartFlows.addSymbol('Arrow', _ChartFlows.classes._Arrow);