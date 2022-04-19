# Was ist das?

Dieser Bot zählt die Nachrichten von anderen Mitgliedern und speichert sie in der Datenbank, man kann die Nachrichten dann mit folgenden Befehl abrufen.

```bash
[prefix]messages
oder
[prefix]messages @Fedox
```

## Installation

Als  erstes die Repo mit folgenden Befehl klonen.

```bash
git clone https://github.com/Fedox-die-Ente/discord-message-counter.git
```

Danach folgenden Befehl eingeben um die Packages zu downloaden.
```bash
npm i
```

Danach die `sample-config.toml` nach Wünschen umändern, danach bei beiden Datein das `sample-` entfernen.

Nun kannst du den Bot mit folgenden Befehl starten.
```bash
node src/app.js
```

## License
[AGPL-3.0](https://choosealicense.com/licenses/agpl-3.0/#)