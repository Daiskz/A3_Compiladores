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

    // error
    getError(error){
        throw new Error(`Expresssão inválida: ${error}`)
    }

    // resultado
    getResult(expression){
        const result = eval(expression)
        console.log(`Resultado: ${result}`)
    }

    // analisador lexico
    lex(){
        for (let i = 0; i < this.input.length; i++) {
            let char = this.input.charAt(i);
            this.getNextToken(char);
        }
        if(this.tokens.length<=0) return this.getError('Expressão sem valores válidos!');
        console.log(`Tokens Gerados:`)
        console.log(this.tokens)
        this.parser();
    }

    getNextToken(char){
        if(char === '') return
        if(char === '.') return this.tokens.push(new Token('DOT', char));
        if(operators.includes(char)) return this.tokens.push(new Token('OPERATOR', char));
        if(char.match(regex)) return this.tokens.push(new Token('NUMBER', char));
        if(char === '(') return this.tokens.push(new Token('RIGHT_PARENTHESIS', char));
        if(char === ')') return this.tokens.push(new Token('LEFT_PARENTHESIS', char));
        return this.getError(`Caractére '${char}' inválido!`);
    }
    
    // analisador sintatico
    parser(){
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
        console.log(`Expressão gerada: ${expression}`)
        this.checkSintax(expression);

    }

    // analisador semantico
    checkSintax(expression){
        let firstChar = expression.charAt(0)
        let lastChar = expression.charAt(expression.length-1)
        
        let leftParenthesis = 0
        let rightParenthesis = 0

        // impede que a expressão comece com / ou *
        let allowedOperators = operators.filter((operator) => operator !== '-' && operator !== '+')

        if(firstChar == ")" || allowedOperators.includes(firstChar)) return this.getError(`A expressão não pode começar com ${firstChar}!`)
        if(lastChar == "(" || operators.includes(lastChar)) return this.getError(`A expressão não pode terminar com ${lastChar}!`)

        for (let i = 0; i < expression.length; i++) {
            if(expression[i] == "(") {
                leftParenthesis++
            }
            if(expression[i] == ")") {
                rightParenthesis++
            }            
        }
        // verifica se a quantidade de parenteses são equivalentes
        return leftParenthesis!=rightParenthesis ? this.getError('Parenteses Incompletos!') : this.getResult(expression)
    }

    interpret(){
        try {
            this.lex();
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

