# Dediche della laurea

Il modulo invia nome e dedica a `https://formspree.io/f/xdeevdqk` tramite
Formspree. L'indirizzo destinatario è configurato nell'account Formspree:
verificare nel pannello che sia `Saglietti.luca@gmail.com` e sia confermato.
L'endpoint è pubblico; il sito non contiene password o chiavi segrete.

L'invio avviene nella pagina con `FormData` e `Accept: application/json`.
Il modulo mantiene la bozza in sessionStorage nella scheda corrente in caso di
errore o ricaricamento e la cancella solo dopo la risposta positiva del servizio.
Blocca i doppi clic, valida i campi, include l'honeypot `_gotcha` e gestisce
limiti di frequenza, timeout ed errori. Non effettua tentativi automatici, perché
un timeout non esclude che il messaggio sia stato già ricevuto.
La conferma indica l'accettazione di Formspree, non la consegna finale in Gmail.

Per verificare la configurazione, inviare una dedica di prova dalla pagina
pubblicata e controllare sia gli invii nel pannello Formspree sia la casella
Gmail (incluso spam). Se l'account richiede una verifica aggiuntiva o un CAPTCHA,
completare la configurazione nel pannello prima di condividere il sito.

Documentazione: https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax
