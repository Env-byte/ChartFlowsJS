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
    }
}


