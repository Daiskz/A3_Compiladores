const Token = require('./token')

const operators = [
    '+',
    '-',
    '*',
    '/'
]

const regex = /\d+/g


class Interpreter {
    constructor(input){
        this.input = input
        this.tokens = []
    }

    getError(error){
        throw new Error(`Expresssão inválida: ${error}`)
    }

    getResult(result){
        console.log(`Input: ${this.input}`)
        console.log(`Result: ${result}`)
    }

    // analisador lexico
    getNextToken(char){
        if(char === '') return
        if(char === '.') return this.tokens.push(new Token('DOT', char));
        if(operators.includes(char)) return this.tokens.push(new Token('OPERATOR', char));
        if(char.match(regex)) return this.tokens.push(new Token('NUMBER', char));
        if(char === '(') return this.tokens.push(new Token('RIGHT_PARENTHESIS', char));
        if(char === ')') return this.tokens.push(new Token('LEFT_PARENTHESIS', char));
        return this.getError(`Caractére ${char} inválido!`);
    }

    parser(){
        console.log(`Tokens Gerados:`)
        console.log(this.tokens)
        let chunks = []
        const operatorsIndex = []
        let chunkCount = 0

        this.tokens.forEach(token => {
            if(token.type === "OPERATOR"){
                operatorsIndex.push(this.tokens.indexOf(token))
            }
        });

        for (let i = 0; i <= operatorsIndex.length; i++) {
            if(this.tokens.slice(chunkCount, operatorsIndex[i]).length > 0){
                let itens = this.tokens.slice(chunkCount, operatorsIndex[i]).map((number => number.value))
                itens.forEach(element => {
                    chunks.push(element)                    
                });
            }
            if(i!=operatorsIndex.length){
                chunks.push(this.tokens[operatorsIndex[i]].value)
                chunkCount = operatorsIndex[i]+1
            }
        }
        let expression = chunks.join('')

        this.getResult(eval(expression))

    }

    // analisador semantico
    checkSintax(input){
        let firstChar = input.charAt(0)
        let lastChar = input.charAt(input.length-1)
        
        let leftParenthesis = 0
        let rightParenthesis = 0

        // impede que a expressão comece com / ou *
        let allowedOperators = operators.filter((operator) => operator !== '-' && operator !== '+')

        if(firstChar == ")" || allowedOperators.includes(firstChar)) return this.getError(`A expressão não pode começar com ${firstChar}!`)
        if(lastChar == "(" || operators.includes(lastChar)) return this.getError(`A expressão não pode terminar com ${lastChar}!`)

        for (let i = 0; i < input.length; i++) {
            if(input[i] == "(") {
                leftParenthesis++
            }
            if(input[i] == ")") {
                rightParenthesis++
            }            
        }
        // verifica se a quantidade de parenteses são equivalentes
        return leftParenthesis!=rightParenthesis ? this.getError('Parenteses Incompletos!') : true
    }

    lex(){
        let check = this.checkSintax(this.input)
        if(check){
            for (let i = 0; i < this.input.length; i++) {
                let char = this.input.charAt(i);
                this.getNextToken(char);
            }
            if(this.tokens.length<=0) return this.getError('Expressão sem valores válidos!');
        }
    }

    interpret(){
        try {
            this.lex();
            this.parser();            
        } catch (error) {
            console.log(error)
        }
    }    
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Digite a expressão matemática que deseja que seja interpretada: ', input => {
    let interpreter = new Interpreter(input);
    interpreter.interpret()
    readline.close()
})

