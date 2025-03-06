# React

## Build App

Prima di tutto:
```bash
npx expo prebuild
```
Genera gli assets delle immagini, aggiorna il manifest...

### Android

Installare Android Studio, leggere i log e installare quello richiesto.
Le variabili d'ambiente da aggiungere dovrebbero essere:
|Nome|Valore|
|-|-|
|`ANDROID_HOME`|C:\Users\\_\<username\>_\AppData\Local\Android\Sdk|
|`ANDROID_SDK_ROOT`| C:\Users\\_\<username\>_\AppData\Local\Android\Sdk|
|`JAVA_HOME`|C:\Program Files\Android\Android Studio\jbr|
|`PATH`|C:\Users\\_\<username\>_\AppData\Local\Android\Sdk\platform-tools <br> C:\Users\\_\<username\>_\AppData\Local\Android\Sdk\tools <br> C:\Users\\_\<username\>_\AppData\Local\Android\Sdk\tools\bin <br> C:\Users\\_\<username\>_\AppData\Local\Android\Sdk\emulator <br> C:\Program Files\Android\Android Studio\jbr\bin |



```bash
cd android
```

Build APK:

```bash
gradlew assembleRelease
```

Build AAB:

```bash
gradlew.bat bundleRelease
```
posizione dell'output: `android\app\build\outputs\bundle\release`

#### Generare la chiave

Genera il keystore
```bash
keytool -genkeypair -v -keystore release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

Genera il file .pem da carica sul play store

```bash
keytool -export -rfc -keystore release-key.keystore -file upload_certificate.pem -alias my-key-alias
```