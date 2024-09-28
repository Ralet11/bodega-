import { useMemo, useState, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { getParamsEnv } from "../../functions/getParamsEnv";
import { useSelector } from "react-redux";
import ToasterConfig from '../../ui_bodega/Toaster';
import toast from 'react-hot-toast';

const { API_URL_BASE } = getParamsEnv();

export default function Index({ shopData, setShopData, latLong }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAvritMA-llcdIPnOpudxQ4aZ1b5WsHHUc",
    libraries: ["places"]
  });

  if (loadError) return <div>Error cargando mapas</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  return <Map shopData={shopData} setShopData={setShopData} latLong={latLong} />;
}

function Map({ shopData, setShopData, latLong }) {
  const token = useSelector((state) => state?.client.token);
  const center = useMemo(() => ({ lat: shopData.lat || 26, lng: shopData.lng || -80 }), [shopData.lat, shopData.lng]);
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState("");
  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const searchResult = useRef(null);

  useEffect(() => {
    if (shopData) {
      setAddress(shopData.address || "");
      setSelected({ lat: shopData.lat || 26, lng: shopData.lng || -80 });
    }
  }, [shopData]);

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
      setIsAddressChanged(true);
    } else {
      alert("Por favor, ingresa una dirección válida");
    }
  };

  const handleConfirmAddress = async () => {
    if (!address || !selected) {
      window.alert("Por favor, ingresa una dirección válida.");
      return;
    }

    const data = {
      address,
      lat: selected.lat,
      lng: selected.lng
    };

   

    try {
      const response = await axios.post(`${API_URL_BASE}/api/local/update/address/${shopData.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast.success("Dirección actualizada exitosamente.");
        setIsAddressChanged(false);
        setShopData((prev) => ({ ...prev, address, lat: selected.lat, lng: selected.lng }));
      } else {
        window.alert("Error actualizando la dirección del local.");
      }
    } catch (error) {
      console.error('Error actualizando el local:', error);
      window.alert("Ocurrió un error al actualizar la dirección del local.");
    }
  };

  const handleInputChange = (e) => {
    setAddress(e.target.value);
    setIsAddressChanged(true);
  };

  const handleInputBlur = async () => {
    if (address) {
      await geocodeAddress(address);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address,
        key: "AIzaSyAvritMA-llcdIPnOpudxQ4aZ1b5WsHHUc"
      }
      });
      const location = response.data.results[0].geometry.location;
      setSelected({ lat: location.lat, lng: location.lng });
    } catch (error) {
      console.error('Error geocodificando la dirección:', error);
    }
  };

  return (
    <div className="w-full h-full p-4 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <GoogleMap zoom={15} center={selected || center} mapContainerClassName="w-full h-56 rounded-lg overflow-hidden shadow-md">
          {selected && <Marker position={{ lat: selected.lat, lng: selected.lng }} />}
        </GoogleMap>
      </div>
      <div className="places-container flex flex-col items-center w-full">
        <Autocomplete onPlaceChanged={handlePlaceSelect} onLoad={autocomplete => (searchResult.current = autocomplete)}>
          <div className="relative flex w-full mt-5">
            <input 
              className="text-black w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
              placeholder="Ingrese la dirección" 
              value={address}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            <button 
              className={`bg-gradient-to-r ml-2 from-blue-500 to-blue-700 text-white p-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 ${!isAddressChanged ? 'bg-gray-400 cursor-not-allowed' : ''}`}
              onClick={handleConfirmAddress}
              disabled={!isAddressChanged}
            >
              Guardar
            </button>
          </div>
        </Autocomplete>
        <ToasterConfig />
      </div>
    </div>
  );
}
