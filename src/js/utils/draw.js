_ChartFlows.utils.draw = {
    /**
     *
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number}thickness
     */
    line: function (x1, y1, x2, y2, thickness) {

    },

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} size (in px)
     * @param {jQuery} parent
     * @param {string} color
     */
    dot: function (x, y, size, color, parent) {
        let style = 'width: ' + size + 'px;' +
            'height:' + size + 'px;' +
            'position:absolute;' +
            'top:' + y + 'px;' +
            'left:' + x + 'px;' +
            'background-color:' + color + ';' +
            'z-index:1000;' +
            'border-radius:50%';
        let dot = $('<div style="' + style + '"></div>')
        dot.appendTo(parent);

        console.log(color + ' Dot', 'X: ' + x, 'Y: ' + y);
    }
}