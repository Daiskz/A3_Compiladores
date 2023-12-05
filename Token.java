public class Token {
    String tokenType;
    String value;

    public Token(String tokenType, String value) {
        this.tokenType = tokenType;
        this.value = value;
    }

    @Override
    public String toString() {
        return tokenType + ": " + value;
    }
}