import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Title from '../../ui_bodega/Title'
import Subtitle from '../../ui_bodega/Subtitle';

import ButtonBodega from '../../ui_bodega/ButtonBodega'

import ThumbnailImage from '../../ui_bodega/ThumbnailImage';

import CheckIcon from '../../icons/checkIcon';
import { useLocation } from 'react-router-dom';

const API_URL_BASE = 'http://127.0.0.1:8080';

const DistProdCard = () => {

    const location = useLocation();
    const { distProduct } = location.state;

    console.log(distProduct)

    const [selectedImage, setSelectedImage] = useState(null);
    const [product, setProduct] = useState({
        id_product: null,
        id_proveedor: null,
        name: '',
        category: '',
        price: null,
        description: '',
        feature_1: '',
        feature_2: '',
        feature_3: '',
        feature_4: '',
        feature_5: '',
        feature_6: '',
        image1: '',
        image2: '',
        image3: ''
    });
    

    const productId = 1

    // Función para cargar los datos del producto cuando el componente se monta
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Hacer la llamada a la API para obtener los datos del producto por su ID
                const response = await axios.get(`${API_URL_BASE}/apiProduct/getProduct/${productId}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                setProduct(response.data.prod); // Actualizar el estado del producto con los datos recibidos
                console.log("Respuesta de la llamada al backend:", response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct(); // Llamar a la función de carga del producto
    }, []);

    console.log("Esto es el product", product)

    const handleThumbnailClick = (imageSrc) => {
        
        setSelectedImage(imageSrc);
    };

  return (
    <div className="flex justify-center bg-white p-10 ">
        <div className="w-1/10  flex flex-col items-center justify-center ">
            <ThumbnailImage src={product.image1} alt="Descripción de la imagen"  onClick={handleThumbnailClick} />
            <ThumbnailImage src={product.image2}  onClick={handleThumbnailClick}/>
            <ThumbnailImage src={product.image3} alt="Descripción de la imagen"  onClick={handleThumbnailClick}/>
        </div>
        
        <div className="w-7/12  flex justify-center items-center">
            <img
            src={selectedImage || "https://e00-expansion.uecdn.es/assets/multimedia/imagenes/2023/01/18/16740587264944.jpg"}
            alt="Descripción de la imagen"
            className="max-w-full max-h-full"
            />
        </div>

      <div className="justify-start w-3/12 ">
        <div className='border-b border-black mt-4'  style={{ height: '100px' }}>
            
            <Title className={'text-start  ml-2 mt-0'} text={product.name}  />
            
        </div>
        <div className='flex-col p-2'>
            <Subtitle className={'text-start ml-2 mt-4'} text="DESCRIPTION"/>
            <div className="flex flex-row justify-around">
                <Subtitle className={'text-start ml-2 mt-2 font-normal'} text={product.description}/>
                
            </div>
        </div>
        <div className='border-b border-black flex-col pb-4'>
            <Subtitle className={'text-start ml-2 mt-4'} text="FEATURES"/>

            <div className="flex flex-row justify-start ml-2">
                <div className='flex flex-col justify-center'>
                    <CheckIcon />
                </div>
                <div className='flex flex-col justify-center'>
                    <Subtitle className={'text-start font-normal'} text={product.feature_1} />
                </div>
            </div>
            <div className="flex flex-row justify-start ml-2">
                <div className='flex flex-col justify-center'>
                    <CheckIcon />
                </div>
                <div className='flex flex-col justify-center'>
                    <Subtitle className={'text-start font-normal'} text={product.feature_2} />
                </div>
            </div>
            
            <div className="flex flex-row justify-start ml-2">
                <div className='flex flex-col justify-center'>
                    <CheckIcon />
                </div>
                <div className='flex flex-col justify-center'>
                    <Subtitle className={'text-start font-normal'} text={product.feature_1} />
                </div>
            </div>

            
        </div>
        <div className='flex flex-row justify-around mt-4'>
            <div className='pt-1 flex items-center justify-center' >
                <Title className={'text-start items-center text-2xl'} text={`$ ${product.price}`} />

            </div>
            <div className=' pt-1'>
                <ButtonBodega className={'flex justify-center text-4xl items-center w-64 h-20'}  type="submit">Buy</ButtonBodega>
            </div>
           
            
        </div>
        
      </div>
    </div>
  );
}

export default DistProdCard;
