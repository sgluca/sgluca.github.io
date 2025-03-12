# React

## Build App

Prima di tutto:
```bash
npx expo prebuild
```
Genera gli assets delle immagini, aggiorna il manifest...

### Android

Per configurare l'ambiente di sviluppo Android, segui questi passaggi:

1. **Installa Android Studio**: Scarica e installa Android Studio dal [sito ufficiale](https://developer.android.com/studio).

2. **Configura le variabili d'ambiente**: Aggiungi le seguenti variabili d'ambiente al tuo sistema:

| Nome | Valore |
|------|--------|
| `ANDROID_HOME` | `C:\Users\<username>\AppData\Local\Android\Sdk` |
| `ANDROID_SDK_ROOT` | `C:\Users\<username>\AppData\Local\Android\Sdk` |
| `JAVA_HOME` | `C:\Program Files\Android\Android Studio\jbr` |
| `PATH` | `C:\Users\<username>\AppData\Local\Android\Sdk\platform-tools;C:\Users\<username>\AppData\Local\Android\Sdk\tools;C:\Users\<username>\AppData\Local\Android\Sdk\tools\bin;C:\Users\<username>\AppData\Local\Android\Sdk\emulator;C:\Program Files\Android\Android Studio\jbr\bin` |

*sostituire `<username>` con il proprio nome utente*

3. **Naviga nella cartella Android**:

```bash
cd android
```

4. **Build APK**:

```bash
gradlew assembleRelease
```

5. **Build AAB**:

```bash
gradlew.bat bundleRelease
```

L'output sarà disponibile nella cartella `android\app\build\outputs\bundle\release`.

#### Generare la chiave

1. **Genera il keystore**:

```bash
keytool -genkeypair -v -keystore release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

2. **Genera il file .pem per il Play Store**:

```bash
keytool -export -rfc -keystore release-key.keystore -file upload_certificate.pem -alias my-key-alias
```

### iOS

Una volta generata la cartella `ios` con il comando iniziale, entrare nella cartella e lanciare:

#### Cambio librerie o primo avvio
```bash
cd ios
pod install
```
Se qualche libreria non funziona, cercare su Google e cambiarla o trovare una soluzione.

#### Compilazione e test
Per compilare effettivamente l'app, testarla e pubblicarla:
```bash
cd ..
xed ios
```
Questo comando aprirà Xcode.

Configurare il nostro release scheme:
1. Dal menu bar, apri **Product** > **Scheme** > **Edit Scheme**.
2. Seleziona **Run** dalla sidebar, poi imposta la configurazione **Build** su **Release** usando il dropdown.

Per compilare: dal menu bar, apri **Product** > **Build**. Questo passaggio compilerà il binario della tua app per il rilascio.

Per lanciare su emulatore o device connesso via USB: in alto sull'header, selezionare il device e premere il pulsante di play.

#### App submission using App Store Connect
Una volta completata la build, puoi distribuire la tua app su TestFlight o inviarla all'App Store utilizzando App Store Connect:
1. Dal menu bar, apri **Product** > **Archive**.
2. Sotto **Archives**, clicca su **Distribute App** dalla sidebar destra.
3. Clicca su **App Store Connect** e segui le istruzioni mostrate nella finestra. Questo passaggio creerà un record dell'App Store e caricherà la tua app sull'App Store.
4. Ora puoi andare al tuo account App Store Connect, selezionare la tua app sotto **Apps** e inviarla per il testing utilizzando TestFlight o prepararla per il rilascio finale seguendo i passaggi nel dashboard di App Store Connect.



https://docs.expo.dev/guides/local-app-production/