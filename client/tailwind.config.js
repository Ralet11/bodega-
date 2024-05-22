/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    flowbite.content()
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-img': "url('https://images.pexels.com/photos/6169660/pexels-photo-6169660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        'custom-img-2': "url('https://images.pexels.com/photos/7363194/pexels-photo-7363194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        'custom-img-login': "url('https://images.pexels.com/photos/5025517/pexels-photo-5025517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          
      },
      color: {
        'gray-700': '#4a5568',
        'green-500': '#48bb78',
        'custom-yellow': '#FFA000',
        'custom-yellow-hover': '#FFD54F'
      }
      
      
    },
  },
  plugins: [
    flowbite.plugin()
    
  ]
};