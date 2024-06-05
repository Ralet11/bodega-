import { useMemo, useState, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { getParamsEnv } from "../../functions/getParamsEnv";
import { useSelector } from "react-redux";

const { API_URL_BASE } = getParamsEnv();

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
  const token = useSelector((state) => state?.client.token);
  const center = useMemo(() => ({ lat: 26, lng: -80 }), []);
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState(shopData.address);
  const [isAddressChanged, setIsAddressChanged] = useState(false);
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
      setIsAddressChanged(true);
    } else {
      alert("Please enter text");
    }
  };

  const handleConfirmAddress = async () => {
    if (!address) {
      window.alert("Please enter a valid address.");
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
      console.log(response.data);
      if (response.status === 200) {
        window.alert("Address updated successfully.");
        setIsAddressChanged(false);
      } else {
        window.alert("Error updating the shop's address.");
      }
    } catch (error) {
      console.error('Error updating the shop:', error);
      window.alert("An error occurred while updating the shop's address.");
    }
  };

  return (
    <div className="w-full h-full p-4 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <GoogleMap zoom={15} center={selected || center} mapContainerClassName="w-full h-64 rounded-lg overflow-hidden shadow-md">
          {selected && <Marker position={{ lat: selected.lat, lng: selected.lng }} />}
        </GoogleMap>
      </div>
      <div className="places-container flex flex-col items-center w-full">
        <Autocomplete onPlaceChanged={handlePlaceSelect} onLoad={autocomplete => (searchResult.current = autocomplete)}>
          <div className="relative flex w-full mt-5">
            <input 
              className="text-black w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
              placeholder={address} 
              onChange={() => setIsAddressChanged(true)}
            />
            <button 
              className={`bg-gradient-to-r ml-2 from-blue-500 to-blue-700 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 ${!isAddressChanged ? 'bg-gray-400 cursor-not-allowed' : ''}`}
              onClick={handleConfirmAddress}
              disabled={!isAddressChanged}
            >
              Save
            </button>
          </div>
        </Autocomplete>
      </div>
    </div>
  );
}