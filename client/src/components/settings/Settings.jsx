import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

import InfoCard from "./infoCard";
import AdressMap from "./AddressMap";
import { useSelector } from "react-redux";
import axios from "axios";
import PayMethods from "./PayMethods";

function Settings() {
  const activeShop = useSelector((state) => state.activeShop);

  const [shopData, setShopData] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    image: null,
  });
  const [latLong, setlatLong] = useState({ lat: null, lng: null });
  const [fetchLatLong, setFetchLatLong] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/local/get/${activeShop}`);
        const data = response.data;
        console.log(data);
        setShopData({
          id: data.id,
          name: data.name,
          phone: data.phone,
          address: data.address,
          image: `http://localhost:3000/${data.img}`,
          category: data.locals_categories_id || ""
        });
  
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
          console.log(lat, lng);
          setlatLong({ lat, lng });
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
      label: "Shop Settings",
      value: "Shop Settings",
      icon: Square3Stack3DIcon,
      desc: (
        <div className=" w-full min-h-[200px] p-4 rounded">
          <div className="flex gap-[60px] p-5">
            <div className=" w-[800px] min-h-[400px] rounded-lg bg-white text-white">
              <div className=" p-5 w-[500px] max-h-[50px]">
                <AdressMap shopData={shopData} setShopData={setShopData} latLong={latLong}/>
              </div>
            </div>
            <div className=" w-full min-h-[400px]">
              <InfoCard shopData={shopData} setShopData={setShopData} />
            </div>
          </div>
          <div></div>
        </div>)
    },
    {
      label: "availability",
      value: "availability",
      icon: UserCircleIcon,
      desc: `Horario en que el shop estara abierto`,
    },
    {
      label: "Pay methods",
      value: "Deliveys",
      icon: Cog6ToothIcon,
      desc: (<div className=" w-full min-h-[200px] p-4 rounded">
      <div className="flex gap-[60px] p-5">
        <div className=" w-[1100px] min-h-[400px] m-auto rounded-lg bg-white text-white">
          <div className=" p-5 w-[500px] max-h-[50px]">
            <PayMethods />
          </div>
        </div>
        
      </div>
      <div></div>
    </div>),
    },
  ];




  return (
    <div className="mt-[100px] ml-[80px] p-5">
      <Tabs value="Shop Settings">
        <TabsHeader>
          {data.map(({ label, value, icon }) => (
            <Tab key={value} value={value}>
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
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

export default Settings