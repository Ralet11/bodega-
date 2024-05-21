import { useMemo, useState, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { getParamsEnv } from "../../functions/getParamsEnv";
import { useSelector } from "react-redux";

const {API_URL_BASE} = getParamsEnv(); 

export default function Index({ shopData, setShopData, latLong }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAfN8bzcreJthGqm_3BaeNC8GYiCAduQgU", // Replace with your API key
    libraries: ["places"]
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return <Map shopData={shopData} latLong={latLong} />;
}

function Map({ shopData, latLong }) {
  const token = useSelector((state) => state?.client.token)
  const center = useMemo(() => ({ lat: 26, lng: -80 }), []);
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState(shopData.address);
  const searchResult = useRef(null);
  

  useEffect(() => {
    if (latLong) {
      setSelected({ lat: latLong.lat || 25.8, lng: latLong.lng || -80.2 });
    }
  }, [latLong]);

  const handlePlaceSelect = () => {
    if (searchResult.current !== null) {
      const place = searchResult.current.getPlace();
      const location = place.geometry.location;
      const lat = location.lat();
      const lng = location.lng();
      
      setAddress(place.formatted_address);

      setSelected({ lat, lng });
    } else {
      alert("Please enter text");
    }
  };

  const handleConfirmAddress = async () => {
    if (!address) {
      window.alert("Por favor, ingresa una dirección válida.");
      return;
    }

    const data = {
      address,
      lat: selected.lat,
      lng: selected.lng
    }

    try {
      const response = await axios.post(`${API_URL_BASE}/api/local/update/address/${shopData.id}`, data,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      console.log(response.data);
      if (response.status === 200) {
        window.alert("Dirección actualizada con éxito");
      } else {
        window.alert("Error al actualizar la dirección de la tienda");
      }
    } catch (error) {
      console.error('Error actualizando la tienda:', error);
      window.alert("Ocurrió un error al actualizar la dirección de la tienda.");
    }
  };



  return (
    <>
      <div>
        <GoogleMap zoom={15} center={selected || center} mapContainerClassName="map-container">
          {selected && <Marker position={{ lat: selected.lat, lng: selected.lng }} />}
        </GoogleMap>
        <div className="places-container flex items-center w-full">
          <Autocomplete onPlaceChanged={handlePlaceSelect} onLoad={autocomplete => (searchResult.current = autocomplete)}>
            <div className="relative flex w-full mt-5">
              <input className="text-black w-[100%] border border-black hover:border-blue-700 p-3" placeholder={address} />
              <button className="bg-blue-500 text-white p-2 rounded ml-2" onClick={handleConfirmAddress}>
                Save
              </button>
            </div>
          </Autocomplete>
        </div>
      </div>
    </>
  );
}

