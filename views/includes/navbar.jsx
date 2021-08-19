var React = require("react");

function NavItem(props) {
  let items;
  if (props.dropdown_items) {
    items = props.dropdown_items.map(function (value, index) {
      return (
        <a
          key={index}
          href={"/" + props.tabel_en_url_naam + "/" + value.url_naam}
          className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
        >
          {value.naam}
        </a>
      );
    });

    return (
      <div className="dropdown relative">
        <div>
          <button className="dropdown-button inline-flex items-center justify-center w-full rounded-md px-3 py-2 text-gray-700 text-sm hover:bg-lime-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-lime-500">
            {props.naam}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div
          className={
            (props.rechts ? "origin-top-right right-0 " : "origin-top-left left-0 ") +
            "dropdown-menu absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden"
          }
        >
          <div className="py-1">{items}</div>
        </div>
      </div>
    );
  } else {
    return (
      <a
        href={"/" + props.tabel_en_url_naam}
        className="w-full rounded-md px-3 py-2 text-gray-700 text-sm hover:bg-lime-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-lime-500"
      >
        {props.naam}
      </a>
    );
  }
}

function NavItemMobile(props) {
  let items;
  if (props.dropdown_items) {
    items = props.dropdown_items.map(function (value, index) {
      return (
        <a
          key={index}
          href={"/" + props.tabel_en_url_naam + "/" + value.url_naam}
          className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
        >
          {value.naam}
        </a>
      );
    });

    return (
      <div className="dropdown relative">
        <div>
          <button className="dropdown-button inline-flex items-center justify-center w-full rounded-md px-3 py-2 text-gray-700 text-sm hover:bg-lime-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-lime-500">
            {props.naam}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div
          className={
            (props.rechts ? "origin-top-right right-0 " : "origin-top-left left-0 ") +
            "dropdown-menu absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden"
          }
        >
          <div className="py-1">{items}</div>
        </div>
      </div>
    );
  } else {
    return (
      <a
        href={"/" + props.tabel_en_url_naam}
        className="w-full rounded-md px-3 py-2 text-gray-700 text-sm hover:bg-lime-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-lime-500"
      >
        {props.naam}
      </a>
    );
  }
}

function Navbar(props) {
  let navLinks, navRechts;
  if (props.navbar) {
    navLinks = props.navbar.map(function (value, index) {
      if (value.rechts === false) {
        return (
          <NavItem
            key={index}
            naam={value.naam}
            dropdown_items={value.dropdown_items}
            tabel_en_url_naam={value.tabel_en_url_naam}
            rechts={false}
          ></NavItem>
        );
      }
    });

    navRechts = props.navbar.map(function (value, index) {
      if (value.rechts === true) {
        return (
          <NavItem
            key={index}
            naam={value.naam}
            dropdown_items={value.dropdown_items}
            tabel_en_url_naam={value.tabel_en_url_naam}
            rechts={true}
          ></NavItem>
        );
      }
    });
  }

  return (
    <nav className="p-2">
      <div className="max-w-6xl mx-auto bg-lime-100 px-4 rounded-lg shadow">
        <div className="flex justify-between h-16">
          <div className="flex space-x-10">
            <div className="flex items-center space-x-2">
              <a
                href="#"
                className="w-full rounded-md px-3 py-2 text-gray-700 font-bold bg-lime-200 hover:bg-lime-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-lime-500"
              >
                Scouts Wondelgem
              </a>
            </div>
            <div className="hidden lg:flex items-center space-x-2">{navLinks}</div>
          </div>
          <div className="hidden lg:flex items-center space-x-2">{navRechts}</div>
          <div className="lg:hidden flex items-center">
            <button
              id="mobile-menu-button"
              className="p-3 w-full rounded-md px-3 py-2 text-gray-700 font-bold hover:bg-lime-300 hover:shadow focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="hamburger-open"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="hamburger-close"
                className="h-6 w-6 hidden"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className="hidden lg:hidden bg-gray-100 rounded-lg shadow mt-2 mx-2">
        <a href="" className="block py-2 px-4 text-sm hover:bg-gray-200 rounded-t-lg">
          Takken
        </a>
        <a href="" className="block py-2 px-4 text-sm hover:bg-gray-200">
          Informatie
        </a>
      </div>
    </nav>
  );
}

module.exports = Navbar;
