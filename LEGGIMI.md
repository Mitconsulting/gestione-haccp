# Gestione HACCP v1.2 — registro OSA per tablet

## Dove sono i dati
Tutti i dati restano **sul tablet** e non vengono inviati a nessun server. Sono salvati nell'archivio interno del browser (IndexedDB), legato all'**indirizzo** da cui si apre l'app.

- Se cambia l'indirizzo (dominio, cartella, http/https) l'app riparte con il registro vuoto. Prima di spostarla, fai un backup e poi ripristinalo.
- Se si cancellano i "dati dei siti" del browser, o si disinstalla l'app, il registro viene perso. Per questo l'app chiede al browser l'archiviazione **persistente**: l'esito si vede in Impostazioni → "Protetto dalla pulizia automatica".
- **Backup**: Impostazioni → *Scarica Backup Completo (.json)*. Il file va nella cartella **Download** del tablet. Dopo 7 giorni senza backup l'app mostra un promemoria. Conviene copiare il file anche su un PC o una chiavetta.

## Installazione sul tablet
Per l'installazione e l'uso offline, il browser richiede che l'app sia servita in **HTTPS** (oppure da `localhost`). Aprendola come file (`file://`) funziona, ma non si installa e non va offline.

1. Pubblica il contenuto della cartella `app/` su uno spazio web HTTPS, per esempio il sito del cliente, Netlify, GitHub Pages o un hosting statico. Il server riceve solo i file dell'app, mai i dati.
2. Sul tablet apri l'indirizzo con **Chrome** (Android) o **Safari** (iPad).
3. Installa l'app:
   - Chrome: menu ⋮ → *Installa app* oppure *Aggiungi a schermata Home*.
   - Safari: Condividi → *Aggiungi alla schermata Home*.
4. Con la connessione attiva apri l'app e **ricaricala una volta**, poi fai una scansione OCR di prova. Da quel momento librerie e dati OCR restano in cache e l'app funziona anche senza rete.

Su iPad, Safari può cancellare i dati dei siti **non installati** dopo 7 giorni di inattività: per questo va sempre usata l'icona sulla schermata Home.

## Primo avvio
Al primo avvio l'app chiede il **nome dell'attività**, mostrato in intestazione, etichette, schede audit ed export. Nella stessa schermata si possono indicare anche l'operatore predefinito e l'email del consulente HACCP, oppure ripristinare un backup esistente. Tutto si può modificare in seguito dalle Impostazioni.
Il nome sotto l'icona del tablet è "Gestione HACCP"; con Chrome su Android si può cambiare al momento dell'installazione.

## Aggiornare l'app
Sostituisci i file sul server e incrementa la costante `CACHE` in `sw.js` (es. `gestione-haccp-v1.2.19`). Il tablet riceve l'aggiornamento alla prima apertura con rete. I dati non vengono toccati.

## Novità rispetto alla v1.1
- Archivio IndexedDB al posto di localStorage, archiviazione persistente e stato dell'archivio nelle Impostazioni.
- Installabile e offline (manifest + service worker).
- Layout a due colonne su tablet: modulo e registro affiancati.
- **Temperatura misurata reale** (es. 3,2) con esito automatico. I limiti sono configurabili: fresco ≤ +4 °C, surgelato ≤ −15 °C. Per i secchi la temperatura è facoltativa.
- Non conformità (temperatura, imballo, prodotto già scaduto): richiedono l'azione correttiva nelle note.
- 14 allergeni (aggiunti arachidi, sesamo, lupini).
- Lotto interno **progressivo** per data di preparazione (`P-AAAAMMGG-01`, `-02`, …).
- Le registrazioni non si cancellano più: si **annullano** con un motivo obbligatorio e restano visibili ed esportate.
- Date calcolate in ora locale (prima erano in UTC).
- Dopo la registrazione il modulo si svuota. Avviso se si registra due volte lo stesso lotto.
- Bozza salvata anche per le etichette (materie prime e allergeni).
- QR più compatto e leggibile; stampa etichetta a 58 o 80 mm, scheda audit su A4.
- PDF, Excel ed Email del registro per periodo Dal/Al (scorciatoie Oggi, Questo mese, Mese scorso, Tutto; A4 orizzontale, non conformi evidenziati, annullati barrati, spazio firma); Excel con colonne Stato ed Esito, righe NC evidenziate.
- Filtro del registro (imbuto accanto alla ricerca): periodo Dal/Al ed esito (tutti, solo non conformi, solo conformi), con riepilogo e "Togli filtro".
- Nuova grafica: tema chiaro (scuro o automatico da Impostazioni o dal pulsante ◐), barra laterale su tablet e in basso su telefono (Ricevimento, Preparazioni, Registro, Anagrafiche, Impostazioni), 4 indicatori con "In scadenza (3 gg)", passi del ricevimento, temperatura con − / + e scala colorata, registro per giorno con filtri rapidi. Versione precedente: tag git `v1.2.17-tema-scuro`.
- OCR migliorato: riconosce lotto, prodotto e scadenza.
- Ripristino del backup con conferma; "Svuota registro" richiede di scrivere SVUOTA e scarica prima un backup.
- Etichette: i campi "Codice lotto" e "Nome materia prima" propongono solo i lotti e i prodotti registrati nel Ricevimento (scegliendo il prodotto si compila il lotto più recente e viceversa); pulsante "Scegli dai lotti ricevuti" con elenco a tocco, avvisi per lotti scaduti o non conformi.
- Fornitori, prodotti e ricette modificabili (Impostazioni → Fornitori, prodotti e ricette, oppure "Gestisci" accanto ai campi di Ricevimento ed Etichette): aggiungi, modifica, elimina. Le registrazioni già salvate non cambiano. Dopo una registrazione con un fornitore, prodotto o ricetta nuovi, l'app propone di aggiungerlo all'elenco. L'anagrafica è inclusa nel backup.
- Logo (scudo con cappello da chef e spunta) per icona del tablet, intestazione e schermata di primo avvio.
- Impostazioni → "Cancella tutti i dati (installazione pulita)": elimina registro, impostazioni, anagrafiche e bozze (conferma scrivendo CANCELLA TUTTO, backup scaricato prima); al riavvio riparte la configurazione iniziale.
