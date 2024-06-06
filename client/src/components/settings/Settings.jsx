import React, { useEffect, useState } from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { Square3Stack3DIcon, StarIcon } from "@heroicons/react/24/solid";
import InfoCard from "./infoCard";
import AddressMap from "./AddressMap";
import { useSelector } from "react-redux";
import axios from "axios";
import { getParamsEnv } from "../../functions/getParamsEnv";
import Balance from "../balanceBodega";



const { API_URL_BASE } = getParamsEnv();

function Settings() {
  const activeShop = useSelector((state) => state.activeShop);
  const client = useSelector((state) => state.client);
  const shop = client.locals.find((local) => local.id === activeShop);

  const [shopData, setShopData] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    image: null,
    lat:null,
    lng:null,
  });
  const [latLong, setLatLong] = useState({ lat: null, lng: null });
  const [fetchLatLong, setFetchLatLong] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/local/get/${activeShop}`);
        const data = response.data;
        setShopData({
          id: data.id,
          name: data.name,
          phone: data.phone,
          address: data.address,
          image: data.img,
          lat:data.lat,
          lng:data.lng,
          category: data.locals_categories_id || ""
        });

        setLatLong({
          lat: data.lat,
          lng:data.lng
        })

        // Activa la solicitud de coordenadas
        setFetchLatLong(true);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchData();
  }, [activeShop]);

  useEffect(() => {
    if (fetchLatLong) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(shopData.address)}&key=${"AIzaSyB0N8k7ZUu4XHMeMzhMICRQ8O8pwynokR8"}`);
          const location = response.data.results[0].geometry.location;
          const lat = location.lat;
          const lng = location.lng;
          setLatLong({ lat, lng });
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
        // Restablece fetchLatLong a false después de la solicitud
        setFetchLatLong(false);
      };

      fetchData();
    }
  }, [shopData, fetchLatLong]);

  const data = [
    {
      label: "Settings",
      value: "Settings",
      icon: Square3Stack3DIcon,
      desc: (
        <div className="w-full min-h-[200px] p-4 rounded">
          <div className="flex flex-col lg:flex-row  gap-4 lg:gap-8 p-5">
            <div className="w-full lg:w-1/2 min-h-[400px] rounded-lg bg-white text-white">
              <div className="p-5 w-full lg:w-full max-h-[50px]">
                <AddressMap shopData={shopData} setShopData={setShopData} latLong={latLong} />
              </div>
            </div>
            <div className="w-full lg:w-1/2 min-h-[400px]">
              <InfoCard shopData={shopData} setShopData={setShopData} />
            </div>
          </div>
        </div>
      )
    },
    {
      label: "Balance",
      value: "Balance",
      icon: StarIcon,
      desc: <Balance />
    }
  ];

  return (
    <div className="bg-gray-200 mt-20 md:w-4/5 pb-20 md:m-auto md:pt-10 relative">
      <Tabs value="Settings"> {/* Set "Settings" as the default tab */}
        <TabsHeader className="flex w-2/3 m-auto relative z-10">
          {data.map(({ label, value, icon }) => (
            <Tab key={value} value={value} className="flex-1">
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody className="relative z-10">
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
}

export default Settings;
