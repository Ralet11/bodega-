import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addPayMethods, removePayMethods } from '../../redux/actions/actions';

function PayMethods() {
  const [selectedPayments, setSelectedPayments] = useState({});
  const [extraInfo, setExtraInfo] = useState({});
  const client = useSelector((state) => state.client);
  const mets = client.client.payMethod;
  const [payMethods, setPayMethods] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3000/api/payment/getPayMethods");
      setPayMethods(response.data);
      console.log(response.data);
    };
    fetchData();
  }, []);

  const handleToggleMethod = async (methodId) => {
    console.log(methodId, "id");
    const isSelected = !!selectedPayments[methodId];

    setSelectedPayments((prevSelectedPayments) => {
      const updatedSelections = { ...prevSelectedPayments };

      if (isSelected) {
        delete updatedSelections[methodId];
        setExtraInfo((prevExtraInfo) => {
          const updatedExtraInfo = { ...prevExtraInfo };
          delete updatedExtraInfo[methodId];
          return updatedExtraInfo;
        });
      } else {
        updatedSelections[methodId] = { checked: true };
        setExtraInfo((prevExtraInfo) => {
          const updatedExtraInfo = { ...prevExtraInfo };
          updatedExtraInfo[methodId] = { secretKey: "", publishableKey: "" };
          return updatedExtraInfo;
        });
      }

      return updatedSelections;
    });

    try {
      if (isSelected) {
        const response = await axios.post("http://localhost:3000/api/payment/disablePayment", {
          data: {
            methodId,
            client: client.client.id
          },
        });
        console.log(response.data, "response");
        dispatch(removePayMethods(response.data));
      } else {
        let methods = [];
        if (client.client.payMethod.length === 0) {
          methods.push(methodId);
        } else {
          methods = client.client.payMethod;
          if (!methods.includes(methodId)) {
            methods.push(methodId);
          }
        }

        console.log(methods);
        console.log("haciendo la peti");
        console.log(client.client.id);
        await axios.post("http://localhost:3000/api/payment/enablePayment", {
          data: {
            methods,
            client: client.client.id,
          },
        });
        console.log("prevDispatch");
        dispatch(addPayMethods(methods));
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
    }
  };

  const test = () => {
    console.log(extraInfo);
  };

  const handleExtraInfoChange = (e, methodId, keyType) => {
    setExtraInfo((prevExtraInfo) => {
      const updatedExtraInfo = { ...prevExtraInfo };
      if (!updatedExtraInfo[methodId]) {
        updatedExtraInfo[methodId] = { secretKey: "", publishableKey: "" };
      }
      updatedExtraInfo[methodId][keyType] = e.target.value;
      return updatedExtraInfo;
    });

    setSelectedPayments((prevSelectedPayments) => {
      const updatedSelections = { ...prevSelectedPayments };
      if (!updatedSelections[methodId]) {
        updatedSelections[methodId] = { checked: true };
      }
      return updatedSelections;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic for handling form submission
  };

  const fetchKeys = async (methodId) => {

    const data = {
      extraInfo,
      methodId,
      client: client
    };

    console.log(data)

    try {
      const response = await axios.post("http://localhost:3000/api/payment/addKeys", data);
      console.log(response.data, "Keys fetched successfully");
    } catch (error) {
      console.error("Error fetching keys:", error);
    }
  };

  return (
    <div className="w-full min-h-[430px] pt-[30px] rounded-lg text-black ">
      <p className='pb-5'>Select your pay methods</p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          {payMethods && payMethods.map((method) => (
            <div
              key={method.id}
              className={`border p-4 ${mets.includes(method.id) ? 'bg-white' : 'bg-gray-200'
              } cursor-pointer flex flex-col items-center`}
            >
              <label>
                <input
                  type="checkbox"
                  value={method.name}
                  checked={mets.includes(method.id)}
                  onChange={() => handleToggleMethod(method.id)}
                />
                <span className="ml-2">{method.name}</span>
              </label>
              <img src={method.image} alt={`${method.name} Logo`} className="mt-3 w-[70px] h-[60px]" />
              <label className="mt-3">
                Secret Key:
                <input
                  type="text"
                  placeholder="Insert Secret Key"
                  value={extraInfo[method.id]?.secretKey || ''}
                  onChange={(e) => handleExtraInfoChange(e, method.id, 'secretKey')}
                  disabled={!selectedPayments[method.id]}
                />
              </label>
              <label className="mt-3">
                Publishable Key:
                <input
                  type="text"
                  placeholder="Insert Publishable Key"
                  value={extraInfo[method.id]?.publishableKey || ''}
                  onChange={(e) => handleExtraInfoChange(e, method.id, 'publishableKey')}
                  disabled={!selectedPayments[method.id]}
                />
              </label>
              <button onClick={() => fetchKeys(method.id)}>Save</button>
            </div>
          ))}
        </div>
        <button onClick={test}>Enviar</button>
      </form>
    </div>
  );
}

export default PayMethods;