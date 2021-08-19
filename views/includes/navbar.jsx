var React = require("react");

// function NavLink(props) {
//   if (props.dropdown_items) {
//     var links = props.dropdown_items.map(function (value, index) {
//       return (
//         <a key={index} href={"/" + props.tabel_en_url_naam + "/" + value.url_naam} className="dropdown-item">
//           {value.naam}
//         </a>
//       );
//     });

//     return (
//       <li id={"navbar" + props.naam} className="nav-item dropdown">
//         <a
//           href={props.tabel_en_url_naam}
//           id={"toggle" + props.naam}
//           role="button"
//           data-toggle="dropdown"
//           aria-haspopup="true"
//           aria-expanded="false"
//           className="nav-link dropdown-toggle"
//         >
//           {props.naam}
//         </a>
//         <div className="dropdown-menu" aria-labelledby={"toggle" + props.naam}>
//           {links}
//         </div>
//       </li>
//     );
//   } else {
//     return (
//       <a id={"navbar" + props.naam} href={"/" + props.tabel_en_url_naam} className="nav-item nav-link">
//         {props.naam}
//       </a>
//     );
//   }
// }

// function Navbar(props) {
//   let navContent;

//   if (props.navbar) {
//     var navLinksLeft = props.navbar.map(function (value, index) {
//       if (value.rechts == false) {
//         return (
//           <NavLink
//             key={index}
//             dropdown_items={value.dropdown_items}
//             naam={value.naam}
//             tabel_en_url_naam={value.tabel_en_url_naam}
//           ></NavLink>
//         );
//       }
//     });
//     var navLinksRight = props.navbar.map(function (value, index) {
//       if (value.rechts == true) {
//         return (
//           <NavLink
//             key={index}
//             dropdown_items={value.dropdown_items}
//             naam={value.naam}
//             tabel_en_url_naam={value.tabel_en_url_naam}
//           ></NavLink>
//         );
//       }
//     });

//     navContent = (
//       <div id="navbarNavAltMarkup" className="collapse navbar-collapse">
//         <div className="navbar-nav">{navLinksLeft}</div>
//         <div className="navbar-nav ml-auto">{navLinksRight}</div>
//       </div>
//     );
//   } else {
//     navContent = (
//       <div id="navbarNavAltMarkup" className="collapse navbar-collapse">
//         <li>
//           <span className="text-danger">Er was een probleem met het inladen van de navigatiebar.</span>
//         </li>
//       </div>
//     );
//   }

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <div id="navbar-container" className="container">
//         {/* Home knop */}
//         <a href="/" className="navbar-brand abs">
//           Scouts Wondelgem
//         </a>

//         {/* Knop die verschijnt bij kleine schermen */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-toggle="collapse"
//           data-target="#navbarNavAltMarkup"
//           aria-controls="navbarNavAltMarkup"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Herin staat de content van de navbar */}
//         {navContent}
//       </div>
//     </nav>
//   );
// }

function Navbar(props) {
  return (
    <nav className="p-2">
      <div className="max-w-6xl mx-auto bg-lime-100 px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-10">
            <div className="flex items-center space-x-2">
              <a href="#" className="py-2 px-2 font-bold text-gray-700 hover:bg-gray-300 hover:text-gray-900">
                Scouts Wondelgem
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="py-2 px-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900">
                Takken
              </a>
              <a href="#" className="py-2 px-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900">
                Informatie
              </a>
              <a href="#" className="py-2 px-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900">
                Agenda
              </a>
              <a href="#" className="py-2 px-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900">
                Foto's
              </a>
              <a href="#" className="py-2 px-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900">
                Verhuur
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="py-2 px-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900">
              Contact
            </a>
            <a href="#" className="py-2 px-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900">
              Aanmelden
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button id="mobile-menu-button" className="py-3">
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

      <div id="mobile-menu" className="hidden md:hidden">
        <a href="" className="block py-2 px-4 text-sm hover:bg-gray-200">
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
