# Dediche della laurea

La pagina GitHub Pages invia nome e dedica con un normale modulo HTML POST a
FormSubmit, con destinatario `Saglietti.luca@gmail.com`. Non apre app di posta e
non richiede credenziali nel codice. L'invio prosegue sulla pagina del servizio,
che gestisce CAPTCHA, attivazione ed errori; dopo il successo ritorna alla pagina
della laurea tramite `_next`.

Non usiamo AJAX: il POST del browser evita preflight e lettura di risposte
cross-origin. Non usiamo `no-cors`, che impedirebbe di verificare la risposta.
Una bozza resta in sessionStorage nella scheda corrente se si torna indietro;
si cancella al ritorno dal servizio dopo l'invio. Il doppio clic è bloccato.

## Attivazione del destinatario

1. Dalla pagina pubblicata, sbloccare il modulo completando il livello 3 e inviare
   una dedica di prova.
2. Aprire la casella destinataria (controllare anche lo spam) e confermare il link
   di attivazione inviato da FormSubmit, se il modulo non è già attivo.
3. Inviare una nuova dedica e verificarne la ricezione prima di condividere il sito.

L'attivazione richiede accesso alla casella e non può essere completata dal codice.
Se il servizio non è raggiungibile, il browser mostra il proprio errore: tornare
indietro conserva la bozza. Prima di riprovare, verificare la casella per evitare
duplicati. Il ritorno `_next` segnala l'accettazione da parte del servizio, non
la consegna finale del messaggio nella casella.

Documentazione: https://formsubmit.co/documentation e https://formsubmit.co/help
