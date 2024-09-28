import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { XCircleIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loader from '../Loader';
import { getParamsEnv } from '../../functions/getParamsEnv';

const { API_URL_BASE } = getParamsEnv();

const CreateDiscountModal = ({
  show,
  handleClose,
  aux,
  setAux,
  product,
}) => {
  const token = useSelector((state) => state?.client.token);
  const shops = useSelector((state) => state?.client.locals);
  const shop_id = useSelector((state) => state?.activeShop);

  const [discount, setDiscount] = useState({
    productName: product ? product.name : '',
    discountType: 'percentage',
    percentage: '',
    fixedValue: '',
    img: null,
    limitDate: '',
    description: '',
    delivery: 1, // Default to "Pick-up"
    usageLimit: 1,
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    conditions: '',
    order_details: [product ? product : {}],
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [shop, setShop] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch the selected shop based on shop_id
  useEffect(() => {
    const selectedShop = shops?.find((shop) => shop.id === shop_id);
    if (selectedShop) {
      setShop(selectedShop);
    }
  }, [shop_id, shops]);

  useEffect(() => {
    if (product) {
      setDiscount((prevState) => ({
        ...prevState,
        productName: product.name,
        order_details: [product],
      }));
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscount((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', // Clear the error message as the user types
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setDiscount((prevState) => ({
        ...prevState,
        img: file,
      }));
      setImagePreview(imageUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!discount.productName.trim())
      newErrors.productName = 'Discount name is required';
    if (
      discount.discountType === 'percentage' &&
      !discount.percentage
    )
      newErrors.percentage = 'Percentage is required';
    if (
      discount.discountType === 'fixedValue' &&
      !discount.fixedValue
    )
      newErrors.fixedValue = 'Fixed value is required';
    if (!discount.limitDate)
      newErrors.limitDate = 'Expiration date is required';
    if (!discount.img) newErrors.img = 'Image is required';
    if (!discount.usageLimit)
      newErrors.usageLimit = 'Usage limit is required';

    // Validate if the discount can be created for the selected order type
    if (discount.delivery === 2 && !shop.delivery) {
      newErrors.delivery =
        'Delivery option is not available for this shop';
    }
    if (discount.delivery === 1 && !shop.pickUp) {
      newErrors.delivery =
        'Pick-up option is not available for this shop';
    }
    if (discount.delivery === 0 && !shop.orderIn) {
      newErrors.delivery =
        'Order-in option is not available for this shop';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (discountId) => {
    if (discount.img) {
      const formData = new FormData();
      formData.append('id', discountId);
      formData.append('action', 'discount');
      formData.append('img', discount.img);

      try {
        const response = await axios.post(
          `${API_URL_BASE}/api/up-image/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.status === 200) {
          console.log('Image uploaded successfully');
        } else {
          console.error('Error uploading image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setDisableSubmit(true);
      setSubmitLoader(true);

      const discountData = {
        productName: discount.productName,
        discountType: discount.discountType,
        percentage:
          discount.discountType === 'percentage'
            ? discount.percentage
            : '',
        fixedValue:
          discount.discountType === 'fixedValue'
            ? discount.fixedValue
            : '',
        limitDate: discount.limitDate,
        description: discount.description,
        shop_id: shop_id,
        delivery: discount.delivery,
        product_id: product.id,
        usageLimit: discount.usageLimit,
        minPurchaseAmount: discount.minPurchaseAmount,
        maxDiscountAmount: discount.maxDiscountAmount,
        conditions: discount.conditions,
        order_details: discount.order_details,
        category_id: product.categories_id,
      };

      if (discount.img) {
        discountData.img = discount.img;
      }

      const response = await axios.post(
        `${API_URL_BASE}/api/discounts/add`,
        discountData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.created === 'ok') {
        await handleImageUpload(response.data.newDiscount.id);
        setSubmitLoader(false);
        setAux(!aux);
        setTimeout(() => {
          closeModal();
          setDisableSubmit(false);
          setDiscount({
            productName: product.name,
            discountType: 'percentage',
            percentage: '',
            fixedValue: '',
            img: null,
            limitDate: '',
            description: '',
            delivery: 1, // Reset to "Pick-up"
            usageLimit: 1,
            minPurchaseAmount: '',
            maxDiscountAmount: '',
            conditions: '',
            order_details: [product],
          });
          setImagePreview(null);
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
        : 'An error occurred';
      console.error('Error creating discount:', errorMessage);
    }
  };

  const closeModal = () => {
    handleClose();
  };

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        closeModal();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  if (!product) return null;

  return (
    <div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white w-full max-w-2xl mx-2 md:mx-auto rounded-lg shadow-lg relative max-h-screen overflow-auto">
            <div className="bg-green-400 p-2 rounded-t-lg">
              <h2 className="text-sm font-semibold text-white">
                Add Discount
              </h2>
            </div>
            <div className="p-2">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                <div className="bg-gray-100 p-2 rounded-lg shadow-md">
                  <h3 className="text-sm font-semibold mb-2">
                    Discount Details
                  </h3>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs">
                      Discount Name
                    </label>
                    <input
                      type="text"
                      name="productName"
                      placeholder="Enter discount name"
                      value={discount.productName}
                      onChange={handleChange}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                    {errors.productName && (
                      <p className="text-red-500 text-xs">
                        {errors.productName}
                      </p>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs">
                      Discount Type
                    </label>
                    <select
                      name="discountType"
                      value={discount.discountType}
                      onChange={handleChange}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixedValue">Fixed Value</option>
                    </select>
                  </div>
                  {discount.discountType === 'percentage' && (
                    <div className="mb-2">
                      <label className="block text-gray-700 text-xs">
                        Percentage
                      </label>
                      <input
                        type="number"
                        name="percentage"
                        placeholder="Enter percentage"
                        value={discount.percentage}
                        onChange={handleChange}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                      />
                      {errors.percentage && (
                        <p className="text-red-500 text-xs">
                          {errors.percentage}
                        </p>
                      )}
                    </div>
                  )}
                  {discount.discountType === 'fixedValue' && (
                    <div className="mb-2">
                      <label className="block text-gray-700 text-xs">
                        Fixed Value
                      </label>
                      <input
                        type="number"
                        name="fixedValue"
                        placeholder="Enter fixed value"
                        value={discount.fixedValue}
                        onChange={handleChange}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                      />
                      {errors.fixedValue && (
                        <p className="text-red-500 text-xs">
                          {errors.fixedValue}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      name="limitDate"
                      placeholder="Enter expiration date"
                      value={discount.limitDate}
                      onChange={handleChange}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                    {errors.limitDate && (
                      <p className="text-red-500 text-xs">
                        {errors.limitDate}
                      </p>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs">
                      Upload Image
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <PhotoIcon className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-500 text-xs">
                        Choose file
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        name="img"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {errors.img && (
                      <p className="text-red-500 text-xs">{errors.img}</p>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      name="usageLimit"
                      placeholder="Enter usage limit"
                      value={discount.usageLimit}
                      onChange={handleChange}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                    {errors.usageLimit && (
                      <p className="text-red-500 text-xs">
                        {errors.usageLimit}
                      </p>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs">
                      Order Type
                    </label>
                    <select
                      name="delivery"
                      value={discount.delivery}
                      onChange={handleChange}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    >
                      {shop.pickUp && (
                        <option value="1">Pick-up</option>
                      )}
                      {shop.delivery && (
                        <option value="2">Delivery</option>
                      )}
                      {shop.orderIn && (
                        <option value="0">Order-in</option>
                      )}
                    </select>
                    {errors.delivery && (
                      <p className="text-red-500 text-xs">
                        {errors.delivery}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg shadow-md flex flex-col justify-center items-center">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Discount Preview"
                      className="w-full h-16 md:h-20 rounded-lg object-cover mb-2"
                    />
                  )}
                  <div className="text-center">
                    <div className="font-bold text-xs mb-1">
                      {discount.productName}
                    </div>
                    <hr className="my-1 border-gray-300" />
                    <p className="text-gray-700 text-xs font-serif italic">
                      {discount.description}
                    </p>
                    <hr className="my-1 border-gray-300" />
                    <p className="text-gray-700 text-xs">
                      {discount.discountType === 'percentage'
                        ? `Percentage: ${discount.percentage}%`
                        : `Fixed Value: $${discount.fixedValue}`}
                    </p>
                    <hr className="my-1 border-gray-300" />
                    <div className="text-gray-700 text-xs">
                      Selected Products:
                    </div>
                    <ul className="text-xs list-disc pl-4">
                      {discount.order_details.map((item, index) => (
                        <li key={index}>{item.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </form>
              <div
                onClick={handleSubmit}
                className="bg-gray-100 px-3 py-2 flex justify-end rounded-b-lg"
              >
                <button
                  className="bg-green-400 text-white py-1 px-2 rounded hover:bg-green-600 w-full mt-2 text-xs"
                  type="submit"
                  disabled={disableSubmit}
                >
                  {submitLoader ? 'Saving...' : 'Save Discount'}
                </button>
              </div>
            </div>
            <div className="bg-gray-100 px-3 py-2 flex justify-end rounded-b-lg">
              <button
                onClick={closeModal}
                className="text-green-500 hover:underline cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CreateDiscountModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  aux: PropTypes.bool.isRequired,
  setAux: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
};

export default CreateDiscountModal;
