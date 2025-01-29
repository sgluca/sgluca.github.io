# Gestione Test del Codice
In vista della certificazione ISO, è necessario impostare e definire una serie di test da eseguire sul codice per garantirne il corretto funzionamento e il rispetto degli standard di qualità.

Le principali aree da testare sono:

    Interazioni con il database e algoritmi
    User Interface (UI)
    Possibili vulnerabilità

## Interazioni con il database / algoritmi
Per poter testare automaticamente le interazioni con il DB e i vari algoritmi si potrebbero usare diversi UnitTest che verificano il corretto comportamento dei controller.
Questo controllo viene fatto secondo le linee guida di sviluppo interne in cui il codice deve di logica deve stare all'interno dei controller.

Durante le prime fasi di analisi ho verificato e testato il funzionamento del collegamento a un database, trovando diverse difficolta.
Nella creazioen di unit test, normalrmente, si utilizzano dei Moq (oggetti fittizzi), questi causano però dei problemi:
 - Non ho un'iterazione effettiva con un DB, se c'è qualche problema di ChangeTracker o Insert/Update/Delete non me ne accorgo
 - Devo inizializzare ogni DbSet manualmente
 ```csharp
    mockSet.As<IQueryable<Ditta>>().Setup(m => m.Provider).Returns(data.Provider);
    mockSet.As<IQueryable<Ditta>>().Setup(m => m.Expression).Returns(data.Expression);
    mockSet.As<IQueryable<Ditta>>().Setup(m => m.ElementType).Returns(data.ElementType);
    mockSet.As<IQueryable<Ditta>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
    _mockContext.Setup(c => c.Ditte).Returns(_mockDitteSet.Object);
```
 questo per ogni singolo DbSet, quindi per esempio anche su i LoggerType.

Queste due problematiche mi portano a dire che forse è più opportuno ragionare su un db veritiero. La questione di avere un Moq sarebbe utile per poter lanciare automaticamente i test tramite pipeline. Forse a sto punto conviene generare un test tramite SQL Server, lanciando i test su una macchina interna che possa interfacciarsi con il docker.


## User Interface
Questo test automaticamente non è semplice effettuarlo. Si può pensare a tool come Selenium che simulano l'interazione dell'utente, ma non viene mai garantito che sia coretto il test, magari manca un'immagine o una regola css e non è da utente.

## Possibili vulnerabilità
Possiamo utilizzare "OWASP Dependency Check" che può essere integrato nelle pipeline ed esporta le problematiche