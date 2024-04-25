/** @type {import('tailwindcss').Config} */
import twElementsPlugin from 'tw-elements/dist/plugin.cjs';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}', './node_modules/tw-elements/dist/js/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [twElementsPlugin]
};