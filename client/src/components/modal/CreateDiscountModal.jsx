import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../Loader";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { getParamsEnv } from "../../functions/getParamsEnv";

const { API_URL_BASE } = getParamsEnv();

const CreateDiscountModal = ({
  aux,
  setAux,
  setShowAddDiscountModal,
  products
}) => {
  const shop_id = useSelector((state) => state?.activeShop);
  const [discount, setDiscount] = useState({
    productName: "",
    discountType: "percentage",
    percentage: "",
    fixedValue: "",
    image: "",
    limitDate: "",
    description: "",
    delivery: 2,
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const token = useSelector((state) => state?.client.token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscount((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleProductSelect = (e) => {
    const { value } = e.target;
    const val = JSON.parse(value);

    setSelectedProducts((prevProducts) => [...prevProducts, val]);
  };

  const removeSelectedProduct = (product) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((selectedProduct) => selectedProduct !== product)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setDisableSubmit(true);
      setSubmitLoader(true);
      const data = {
        productName: discount.productName,
        discountType: discount.discountType,
        percentage: discount.discountType === "percentage" ? discount.percentage : undefined,
        fixedValue: discount.discountType === "fixedValue" ? discount.fixedValue : undefined,
        image: discount.image,
        limitDate: discount.limitDate,
        description: discount.description,
        shop_id,
        delivery: discount.delivery,
        order_details: [{ order_details: selectedProducts }],
        product_id: selectedProducts[0].id
      };

      console.log(data)

      const response = await axios.post(
        `${API_URL_BASE}/api/discounts/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.created === "ok") {
        setSubmitLoader(false);
        setAux(!aux);
        setTimeout(() => {
          closeModal();
          setDisableSubmit(false);
          setDiscount({
            productName: "",
            discountType: "percentage",
            percentage: "",
            fixedValue: "",
            image:
              "https://res.cloudinary.com/doyafxwje/image/upload/v1704906320/no-photo_yqbhu3.png",
            limitDate: "",
            description: "",
            delivery: 2,
          });
          setSelectedProducts([]);
        }, 3000);
      } else {
        setDisableSubmit(false);
        setSubmitLoader(false);
      }
    } catch (error) {
      setDisableSubmit(false);
      setSubmitLoader(false);
      const errorMessage = error.response
        ? error.response.data
        : "An error occurred";
    }
  };

  const closeModal = () => {
    setShowAddDiscountModal(false);
  };

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        closeModal();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      >
        <div className="w-11/12 max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Add New Discount
            </h1>
            <XCircleIcon
              onClick={closeModal}
              className="cursor-pointer w-6 h-6 text-gray-800 dark:text-gray-200 hover:text-red-600"
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Discount Name
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="productName"
                  value={discount.productName}
                  placeholder="Discount name"
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={discount.discountType}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixedValue">Fixed Value</option>
                </select>
              </div>
              {discount.discountType === "percentage" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discount Percentage
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="percentage"
                    value={discount.percentage}
                    placeholder="Discount percentage"
                    className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                  />
                </div>
              )}
              {discount.discountType === "fixedValue" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fixed Value
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="fixedValue"
                    value={discount.fixedValue}
                    placeholder="Fixed value"
                    className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expiration Date
                </label>
                <input
                  onChange={handleChange}
                  type="date"
                  name="limitDate"
                  value={discount.limitDate}
                  placeholder="Expiration date"
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image Link
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="image"
                  value={discount.image}
                  placeholder="Image link"
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                />
                <div className="mt-2">
                  <img
                    className="w-24 h-24 rounded-md object-cover"
                    src={discount.image}
                    alt="Product"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Order Type
                </label>
                <select
                  name="delivery"
                  value={discount.delivery}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                >
                  <option value="0">Pick-up / Delivery</option>
                  <option value="1">Order-in</option>
                  <option value="2">All</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  onChange={handleChange}
                  name="description"
                  value={discount.description}
                  placeholder="Description"
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                  rows="4"
                ></textarea>
              </div>
            </div>
            <div className="relative mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Selected Products
              </label>
              <div
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                {isSelectOpen ? "Close" : "Open"} Product Select
              </div>
              {isSelectOpen && (
                <select
                  onChange={handleProductSelect}
                  className="absolute mt-2 w-full border border-gray-300 rounded-md shadow-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                  multiple
                  style={{ zIndex: 999 }}
                >
                  {products.map((product) => (
                    <option key={product.id} value={JSON.stringify(product)}>
                      {product.name}
                    </option>
                  ))}
                </select>
              )}
              <div className="mt-2 flex flex-wrap">
                {selectedProducts.map((selectedProduct) => (
                  <span
                    key={selectedProduct.id}
                    className="flex items-center bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 mr-2 mb-2"
                  >
                    {selectedProduct.name}
                    <button
                      onClick={() => removeSelectedProduct(selectedProduct)}
                      className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              {!submitLoader ? (
                <button
                  type="submit"
                  disabled={disableSubmit}
                  className="px-4 py-2 w-full sm:w-auto bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400"
                >
                  Create New Discount
                </button>
              ) : (
                <Loader />
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateDiscountModal;