# Pulizia file MD

Ricerca:
```bash
dir net6.0  /AD /s
```

Eliminazione:

```bash
for /f "usebackq" %d in (`"dir net6.0 /ad/b/s"`) do rd /s/q "%d"
```