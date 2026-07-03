class DomainNotFoundError(RuntimeError):
    """Raised when a requested domain resource does not exist."""


class DomainValidationError(RuntimeError):
    """Raised when a domain rule prevents an operation from completing."""
