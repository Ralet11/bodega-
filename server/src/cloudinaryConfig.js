import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'doqyrz0sg', // Reemplaza con el nombre de tu nube
  api_key: '514919588344698', // Reemplaza con tu clave de API
  api_secret: 'bv6pnA7aXQMK4VSjm5qwMIvBk3s' // Reemplaza con tu secreto de API
});

export default cloudinary;