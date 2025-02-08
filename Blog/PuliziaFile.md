# Pulizia file MD

Ricerca:

dir net6.0  /AD /s


Eliminazione:


for /f "usebackq" %d in (`"dir net6.0 /ad/b/s"`) do rd /s/q "%d"