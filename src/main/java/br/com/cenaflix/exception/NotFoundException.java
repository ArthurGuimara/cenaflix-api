package br.com.cenaflix.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) { super(message); }
}
