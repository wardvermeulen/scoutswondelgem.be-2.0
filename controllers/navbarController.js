require("dotenv").config();

const { Pool } = require("pg");
const pool = new Pool();

exports.getNavbar = async function (req, res, next) {
  let navbar, tabel;

  // Afhankelijk van of de gebruiker is aangemeld of niet, wordt tabel ingesteld op "gebruiker" of
  // op "admin".
  if (!req.session.ingelogd || req.session.ingelogd == false) {
    tabel = "gebruiker";
  } else if (req.session.ingelogd == true) {
    tabel = "admin";
  }

  try {
    navbar = await pool.query("SELECT * FROM navbar WHERE " + tabel + " = true ORDER BY rechts, volgorde");
  } catch (err) {
    // ! Somehow log this
    return next();
  }

  req.session.navbarData = navbar.rows;
  await exports.getDropdownItems(req, res, next);

  return next();
};

exports.getDropdownItems = async function (req, res, next) {
  // Hier wordt alle data uit de tabellen gehaald waarvoor dropdown = true. Een rij kan dus
  // enkel true hebben voor dropdown als er een tabel bestaand met dezelfde naam als
  // tabel_en_url_naam! Moest dit toch niet zo zijn, is dit geen probleem en wordt de navbar
  // item gewoon als normale link gerendered, ipv als dropdown.
  await Promise.all(
    req.session.navbarData.map(async function (row, index, array) {
      if (row.dropdown == true) {
        try {
          const dropdownResult = await pool.query(
            "SELECT naam, url_naam FROM " + row.tabel_en_url_naam + " ORDER BY volgorde"
          );
          req.session.navbarData[index].dropdown_items = dropdownResult.rows;
        } catch (err) {
          // ! Somehow log this (should not return)
        }
      }
    })
  );
};
