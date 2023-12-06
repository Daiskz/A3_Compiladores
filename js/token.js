class Token{
    constructor(type, value){
        this.type = type
        this.value = value
    }

    getToken(){
        return this;
    }
}

module.exports = Token