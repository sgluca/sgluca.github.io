---
layout: default
title: "Gestione Test del Codice"
description: "Guida alla gestione e organizzazione dei test del codice"
section: "🔍 Analisi"
section_url: "/Analisi/"
show_back_button: true
back_url: "/Analisi/"
---

# Gestione Test del Codice
In vista della certificazione ISO, è necessario impostare e definire una serie di test da eseguire sul codice per garantirne il corretto funzionamento e il rispetto degli standard di qualità.

Le principali aree da testare sono:
- Interazioni con il database e algoritmi
- User Interface (UI)
- Possibili vulnerabilità

## Interazioni con il database / algoritmi
Per testare in modo automatico le interazioni con il database e verificare il corretto funzionamento degli algoritmi, si suggerisce di utilizzare UnitTest che possano validare il comportamento dei controller. Questo test viene eseguito seguendo le linee guida interne, secondo cui la logica applicativa deve essere contenuta all'interno dei controller.

Durante le fasi iniziali di analisi, ho riscontrato alcune difficoltà nella creazione dei test. In particolare, l'uso di oggetti fittizi tramite Moq (mocking) ha presentato delle problematiche:
 - **Assenza di interazione effettiva con il database:** Utilizzare oggetti fittizi non consente di rilevare eventuali errori legati al `ChangeTracker` o alle operazioni di `Insert/Update/Delete`, che potrebbero passare inosservati.
 - Inizializzazione manuale di ogni `DbSet`: Ogni DbSet deve essere inizializzato manualmente, il che comporta una gestione complessa del codice di test. Ad esempio, per ogni `DbSet` si deve scrivere una configurazione simile alla seguente:
 ```csharp
    mockSet.As<IQueryable<Ditta>>().Setup(m => m.Provider).Returns(data.Provider);
    mockSet.As<IQueryable<Ditta>>().Setup(m => m.Expression).Returns(data.Expression);
    mockSet.As<IQueryable<Ditta>>().Setup(m => m.ElementType).Returns(data.ElementType);
    mockSet.As<IQueryable<Ditta>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
    _mockContext.Setup(c => c.Ditte).Returns(_mockDitteSet.Object);
```
Questo approccio deve essere ripetuto per ogni singolo `DbSet`, come ad esempio anche per i `LoggerType`.

Le problematiche sopra descritte suggeriscono che potrebbe essere più opportuno considerare l'uso di un database reale per i test. Sebbene l'uso di Moq consenta di eseguire i test automaticamente tramite pipeline, potrebbe essere vantaggioso eseguire i test su un database vero, per verificare anche le operazioni più complesse. Una possibile soluzione sarebbe lanciare i test su un server SQL interno, configurato per interfacciarsi con un contenitore Docker.


## User Interface
Testare automaticamente la User Interface (UI) può risultare particolarmente complesso. Sebbene strumenti come Selenium permettano di simulare l'interazione dell'utente con la UI, non vi è mai una garanzia assoluta che il test venga eseguito correttamente. Alcuni elementi, come immagini mancanti o errori nei CSS, potrebbero non essere rilevati, ma potrebbero compromettere l'esperienza dell'utente finale. È quindi importante adottare una strategia combinata che preveda anche il controllo manuale di elementi visivi e funzionali.

## Possibili vulnerabilità
Per quanto riguarda le vulnerabilità di sicurezza, è consigliabile integrare il tool [OWASP Dependency](https://marketplace.visualstudio.com/items?itemName=dependency-check.dependencycheck) Check all'interno delle pipeline di sviluppo. Questo strumento consente di analizzare le dipendenze del progetto e identificare vulnerabilità note nelle librerie utilizzate. Il report generato da OWASP Dependency Check può essere esportato e utilizzato per adottare misure correttive tempestive.