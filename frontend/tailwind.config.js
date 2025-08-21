module.exports = {
  content: ['./src/*/.{js,jsx,ts,tsx}', './node_modules/@fortawesome/fontawesome-free/*/.js', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
      spacing: {
        '7xl': '80rem',
      },
      colors: {
        primary: '#E3C6B8',
        secondary: '#E8E1D8',
        accent: '#A73249',
        highlight: '#3D1609'
      }
    }
  },
  safelist: [
    {
      pattern: /^fa-/,
    }
  ],
  plugins: [require("tailgrids/plugin")]
}
