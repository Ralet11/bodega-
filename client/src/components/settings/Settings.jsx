import React, { useEffect, useState } from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { Square3Stack3DIcon, StarIcon } from "@heroicons/react/24/solid";
import InfoCard from "./infoCard";
import AddressMap from "./AddressMap";
import { useSelector } from "react-redux";
import axios from "axios";
import { getParamsEnv } from "../../functions/getParamsEnv";
import Balance from "../balanceBodega";
import toast from 'react-hot-toast';

const { API_URL_BASE } = getParamsEnv();

function Settings() {
  const activeShop = useSelector((state) => state.activeShop);
  const client = useSelector((state) => state.client);

  const [shopData, setShopData] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    image: null,
    lat: null,
    lng: null,
  });
  const [latLong, setLatLong] = useState({ lat: null, lng: null });
  const [fetchLatLong, setFetchLatLong] = useState(false);
  const [certificates, setCertificates] = useState({
    resaleCertificate: null,
    tobaccoLicense: null,
    fein: null,
    pictureId: null,
  });
  const [certificateStatuses, setCertificateStatuses] = useState({
    resaleCertificate: '',
    tobaccoLicense: '',
    fein: '',
    pictureId: '',
  });

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
          lat: data.lat,
          lng: data.lng,
          category: data.locals_categories_id || ""
        });

        setLatLong({
          lat: data.lat,
          lng: data.lng
        });

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
          const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(shopData.address)}&key=${"YOUR_GOOGLE_API_KEY"}`);
          const location = response.data.results[0].geometry.location;
          const lat = location.lat;
          const lng = location.lng;
          setLatLong({ lat, lng });
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
        setFetchLatLong(false);
      };

      fetchData();
    }
  }, [shopData, fetchLatLong]);

  const handleCertificateChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setCertificates({
        ...certificates,
        [type]: file,
      });
    }
  };

  const handleCertificateUpload = async (type) => {
    const certificate = certificates[type];
    if (certificate) {
      const formData = new FormData();
      formData.append('id', shopData.id);
      formData.append('email', 'proyectoapptrader@gmail.com');
      formData.append('certificate', certificate);

      try {
        const response = await axios.post(`${API_URL_BASE}/api/local/uploadCertificate`, formData, {
          headers: {
            Authorization: `Bearer ${client.token}`
          }
        });
        if (response.status === 200) {
          toast.success(`${type} uploaded successfully`);
          setCertificateStatuses({
            ...certificateStatuses,
            [type]: 'Uploaded',
          });
        } else {
          toast.error(`Error uploading ${type}`);
          setCertificateStatuses({
            ...certificateStatuses,
            [type]: 'Error',
          });
        }
      } catch (error) {
        console.error(`Error uploading ${type}:`, error);
        toast.error(`Error uploading ${type}`);
        setCertificateStatuses({
          ...certificateStatuses,
          [type]: 'Error',
        });
      }
    }
  };

  const data = [
    {
      label: "Settings",
      value: "Settings",
      icon: Square3Stack3DIcon,
      desc: (
        <div className="w-full min-h-[200px] p-4 rounded">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 p-2">
            <div className="w-full lg:w-1/2 min-h-[300px] rounded-lg bg-white text-white">
              <div className="p-2 w-full lg:w-full max-h-[50px]">
                <AddressMap shopData={shopData} setShopData={setShopData} latLong={latLong} />
              </div>
            </div>
            <div className="w-full lg:w-1/2 min-h-[300px]">
              <InfoCard shopData={shopData} setShopData={setShopData} />
            </div>
          </div>
        </div>
      )
    }/* ,
    {
      label: "Balance",
      value: "Balance",
      icon: StarIcon,
      desc: <Balance />
    } */
  ];

  return (
    <div className="bg-gray-200 mt-20 md:w-11/12 lg:w-4/5 pb-20 md:m-auto md:pt-10 relative">
      <Tabs value="Settings"> {/* Set "Settings" as the default tab */}
        <TabsHeader className="flex w-full md:w-2/3 md:pt-20 m-auto relative z-10">
          {data.map(({ label, value, icon }) => (
            <Tab key={value} value={value} className="flex-1">
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-4 h-4" })}
                <span className="text-xs">{label}</span>
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
      <div className="bg-white p-2 rounded-lg shadow-lg mt-4">
        <h2 className="text-base font-semibold mb-2 text-gray-800">Upload Certificates</h2>
        <div className="grid grid-cols-1 gap-2">
          {['resaleCertificate', 'tobaccoLicense', 'fein', 'pictureId'].map((type, index) => (
            <div key={index} className="flex flex-col gap-1">
              <label className="block text-gray-500 text-xs font-medium">
                {type === 'resaleCertificate' && 'Resale Certificate *'}
                {type === 'tobaccoLicense' && 'Cigar/Tobacco/Cigarette/OTP License *'}
                {type === 'fein' && 'FEIN# *'}
                {type === 'pictureId' && 'Official Picture ID *'}
              </label>
              <input type="file" onChange={(e) => handleCertificateChange(e, type)} className="text-xs" />
              <p className="text-xs text-gray-600">
                {type === 'resaleCertificate' && 'Upload re-sale certificate here.'}
                {type === 'tobaccoLicense' && 'Upload copies of your license here.'}
                {type === 'fein' && 'Upload Federal EIN document here.'}
                {type === 'pictureId' && 'Upload your ID here.'}
              </p>
              <button
                onClick={() => handleCertificateUpload(type)}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-1 px-2 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 text-xs"
              >
                Upload {type}
              </button>
              {certificateStatuses[type] && (
                <p className="mt-1 text-xs text-gray-600">
                  {certificateStatuses[type] === 'Uploaded' ? `${type} uploaded successfully.` : `Error uploading ${type}.`}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;