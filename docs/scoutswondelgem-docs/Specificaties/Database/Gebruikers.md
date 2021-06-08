| id (**PKEY**) | email (**UNIQUE**) | naam | wachtwoord | tak | afbeelding | gsm | wachtwoord_laatste_verandering |
| :- | :- | :- | :- | :- | :- | :- | :- |
|  serial (integer) | varchar | varchar | varchar | varchar | varchar | varchar | timestamp |
| autoincrement id | ..@scoutswondelgem.be | Voornaam Achternaam | `bcrypt` hash | i.e. "Kapoenen" of "Jonggidsen" | pad naar afbeelding | GSM-nummer | epoch (unix-tijd) |

