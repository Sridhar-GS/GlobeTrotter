def to_float(value) -> float:
    try:
        return float(value)
    except Exception:
        return 0.0
