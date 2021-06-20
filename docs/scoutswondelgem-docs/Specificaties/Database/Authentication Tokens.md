---
date updated: '2021-06-20T23:19:28+02:00'

---

| id (**PKEY**)    | series_identifier (**UNIQUE**)     | token                    | gebruikers_id (**FKEY**)                       | vervaldatum                   |
| :--------------- | :--------------------------------- | :----------------------- | :--------------------------------------------- | :---------------------------- |
| serial (integer) | varchar                            | varchar                  | integer                                        | timestamp (without time zone) |
| autoincrement id | plain text onderdeel van de cookie | _SHA-256_ hash van token | referentie naar de gebruiker in [[Gebruikers]] | wanneer de cookie vervalt     |
