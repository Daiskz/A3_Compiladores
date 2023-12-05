import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Interpreter {
    String code;
    List<Token> tokens;
    int pos;

    public Interpreter(String code) {
        this.code = code;
        this.tokens = new ArrayList<>();
        this.pos = 0;
    }

    public void error() {
        throw new RuntimeException("Erro de parser");
    }

    public Token getNextToken() {
        while (pos < code.length()) {
            char character = code.charAt(pos);
            pos++;

            if (character == ' ') {
                continue;
            }
            if (character == '+' || character == '-' || character == '*' || character == '/') {
                return new Token("OPERATOR", String.valueOf(character));
            }
            if (Character.isDigit(character)) {
                return new Token("NUMBER", String.valueOf(character));
            }
            if (character == ')') {
                return new Token("RIGHT_PAREN", String.valueOf(character));
            }
            if (character == '(') {
                return new Token("LEFT_PAREN", String.valueOf(character));
            }
            error();
        }
        return new Token("EOF", null);
    }

    public void lex() {
        while (true) {
            Token token = getNextToken();
            if (token.tokenType.equals("EOF")) {
                break;
            }
            tokens.add(token);
        }
    }

    public int parse() {
        while (true) {
            if (tokens.get(0).tokenType.equals("NUMBER")) {
                return Integer.parseInt(tokens.remove(0).value);
            } else if (tokens.get(0).tokenType.equals("OPERATOR")) {
                String op = tokens.remove(0).value;
                int a = parse();
                int b = parse();
                if (op.equals("+")) {
                    return a + b;
                } else if (op.equals("-")) {
                    return a - b;
                } else if (op.equals("*")) {
                    return a * b;
                } else if (op.equals("/")) {
                    return a / b;
                }
            } else if (tokens.get(0).tokenType.equals("LEFT_PAREN")) {
                tokens.remove(0);
                int a = parse();
                tokens.remove(0);
                int b = parse();
                return a + b;
            } else {
                error();
            }
        }
    }

    public void interpret() {
        lex();
        int result = parse();
        System.out.println("Result: " + result);
    }
    
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.println("Faça uma expressão de matematica usando: '+', '-', '*', '/' e parentêses: ");
            String inputCode = scanner.nextLine();
            Interpreter interpreter = new Interpreter(inputCode);
            interpreter.interpret();
        }
    }
}