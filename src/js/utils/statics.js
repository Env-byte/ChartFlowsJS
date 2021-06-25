let _IdsInUse = []

class StaticHelpers {

    static _genId() {
        let result, characters, charactersLength;

        do {
            result = '';
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            charactersLength = characters.length;
            for (let i = 0; i < 12; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            // check if id is currently in use
        } while (_IdsInUse.indexOf(result) !== -1);

        _IdsInUse.push(result);
        return result;
    }

    static releaseId(result) {
        let index = _IdsInUse.indexOf(result)
        if (index !== -1) {
            _IdsInUse.splice(index, 1);
        }
    }
}