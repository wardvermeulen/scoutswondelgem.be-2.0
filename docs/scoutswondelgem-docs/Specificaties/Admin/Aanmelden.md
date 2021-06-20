---
date updated: '2021-06-09T17:45:48+02:00'

---

# Login

Hoewel de loginpagina in principe onderdeel is van wat de doorsnee bezoeker kan zien, is die echter strikt bedoeld voor de leidingsploeg en de vzw. Het is een van de meest fundamentele basisfunctionaliteiten van de website.

---

## Form

| Label      | Verwachte input                                                                        |
| :--------- | :------------------------------------------------------------------------------------- |
| Email      | **niet case-sensitive** emailadres van @scoutswondelgem.be (niet strikt, bv. voor vzw) |
| Wachtwoord | case-sensitive wachtwoord, gehasht met _bcrypt_                                        |

---

## Routes

```javascript
/* Rendert de form */
app.get("/aanmelden")

/* Verwerkt de form data die verstuurd is */ 
app.post("/aanmelden") 
```

---

## Werking

Bekijk eerst de tabelstructuur van de gebruikers: [[Gebruikers]].

Er zijn twee manieren waarop een gebruiker kan inloggen:

1. Met een sessie
2. Met een cookie, via _Aangemeld blijven_

**Maar eerst vooraleer de content gerenderd wordt:** (login check).

### Sessie

1. Het emailadres wordt gecheckt tegenover de database.
   1. Aangezien het emailadres uniek is, returnt de query één resultaat.
   2. Als de query niets teruggeeft, was het emailadres fout, en wordt er een error verstuurd naar de frontend.
2. Het wachtwoord wordt vergeleken met het gehashte wachtwoord met behulp van _bcrypt_.
   1. Als het wachtwoord effectief klopt, wordt alle informatie van de rij (**behalve de hash, onveilig**) opgeslagen in sessievariabelen.
   2. Als de functie _false_ teruggeeft, wordt opnieuw een error verstuurd naar de frontend.

**Belangrijk:** De error mesages moeten telkens dezelfde zijn! Er mag geen informatie worden doorgespeeld over of het emailadres of het wachtwoord fout is.

### Cookies

Copy-paste van StackOverflow:  [security - What is the best way to implement "remember me" for a website? - Stack Overflow](https://stackoverflow.com/questions/244882/what-is-the-best-way-to-implement-remember-me-for-a-website)

1.  When the user successfully logs in with Remember Me checked, a **login cookie is issued** in addition to the standard session management cookie.
2.  The login cookie contains **a series identifier and a token**. The series and token are **unguessable random numbers** from a suitably large space. Both are stored together in a database table, **the token is hashed** (sha256 is fine).
3.  When a non-logged-in user visits the site and presents a login cookie, the series identifier is **looked up in the database**.
    1.  If the **series identifier** is present and the hash of the **token** matches the hash for that series identifier, the user is considered **authenticated**. A **new token** is generated, a new hash for the token is stored over the old record, and a new login cookie is issued to the user (it's okay to re-use the **series identifier**).
    2.  If the series is present but the token does not match, a **theft** is assumed. The user receives a strongly worded warning and all of the user's remembered sessions are deleted.
    3.  If the username and series are not present, the login cookie is **ignored**.

This approach provides defense-in-depth. If someone manages to leak the database table, it does not give an attacker an open door for impersonating users.

De tabelstructuur voor deze tokens is gegeven in [[Authentication Tokens]].