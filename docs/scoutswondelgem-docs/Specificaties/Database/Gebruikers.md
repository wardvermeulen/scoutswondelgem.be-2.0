---
date updated: '2021-06-09T17:45:07+02:00'

---

| id (**PKEY**)    | email (**UNIQUE**)      | naam                | wachtwoord    | tak                             | afbeelding          | gsm        | wachtwoord_laatste_verandering |
| :--------------- | :---------------------- | :------------------ | :------------ | :------------------------------ | :------------------ | :--------- | :----------------------------- |
| serial (integer) | varchar                 | varchar             | varchar       | varchar                         | varchar             | varchar    | timestamp                      |
| autoincrement id | <..@scoutswondelgem.be> | Voornaam Achternaam | _bcrypt_ hash | i.e. "Kapoenen" of "Jonggidsen" | pad naar afbeelding | GSM-nummer | epoch (unix-tijd)              |
