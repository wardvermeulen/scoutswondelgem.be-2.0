const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./views/**/*.jsx", "./public/**/*.js"],
  darkMode: "class",
  theme: {
    colors: colors,
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
