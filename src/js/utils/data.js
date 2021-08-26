_ChartFlows.utils.data = class {
    constructor(data) {
        this._data = [];
        if (data && data.length) {
            for (let i = 0, iL = data.length; i < iL; i++) {
                if (data[i].hasOwnProperty('name') && data[i].hasOwnProperty('value')) {
                    this.add(data[i].name, data[i].value)
                }
            }
        }
    }

    /**
     *
     * @param {string} name
     * @param {string} value
     */
    add(name, value) {
        //remove if name already exists
        let index = this.getIndex(name);
        if (index !== false) {
            this.remove(index);
        }
        this._data.push({name: name, value: value})
    }

    /**
     *
     * @param {string} name
     * @return {boolean|string}
     */
    get(name) {
        let val = false;
        for (let i = 0, iL = this._data.length; i < iL; i++) {
            if (this._data[i].name === name) {
                val = this._data[i].value;
            }
        }
        return val;
    }

    /**
     *
     * @param {string} name
     * @return {boolean|number}
     */
    getIndex(name) {
        let val = false;
        for (let i = 0, iL = this._data.length; i < iL; i++) {
            if (this._data[i].name === name) {
                val = i;
            }
        }
        return val;
    }

    /**
     *
     * @param {number} index
     */
    remove(index) {
        this._data.splice(index, 1);
    }

    /**
     *
     * @return {{}}
     */
    serialize() {
        return $.extend(true, {}, this._data);
    }
}