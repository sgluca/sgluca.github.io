# Dediche della laurea

La pagina GitHub Pages invia nome e dedica direttamente dal modulo, senza aprire
un'app di posta, tramite l'endpoint AJAX di FormSubmit. Destinatario:
`Saglietti.luca@gmail.com`. Non servono credenziali nel codice del sito.

## Attivazione del destinatario

1. Dalla pagina pubblicata, sbloccare il modulo completando il livello 3 e inviare
   una dedica di prova.
2. Aprire la casella destinataria (controllare anche lo spam) e confermare il link
   di attivazione inviato da FormSubmit, se il modulo non è già attivo.
3. Inviare una nuova dedica e verificarne la ricezione prima di condividere il sito.

L'attivazione richiede accesso alla casella e non può essere completata dal codice.
Il modulo mantiene i dati e mostra un errore se il servizio non conferma l'invio;
il successo richiede sia una risposta HTTP valida sia `success: true` (booleano
o stringa). Le risposte di attivazione non sono considerate invii riusciti.
Il blocco durante la richiesta evita doppi clic; un timeout non garantisce che
il servizio non abbia già ricevuto il messaggio.

Documentazione: https://formsubmit.co/ajax-documentation e https://formsubmit.co/help
