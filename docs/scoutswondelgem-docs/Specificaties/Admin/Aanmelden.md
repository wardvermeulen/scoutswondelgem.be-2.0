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
