import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "../Loader";
import { UploadWidget } from "./widgetUpload";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { getParamsEnv } from "../../functions/getParamsEnv";

const {API_URL_BASE} = getParamsEnv()

const CreateDiscountModal = ({
    aux,
    setAux,
    setShowAddDiscountModal,
    products
}) => {
    const shop_id = useSelector((state) => state?.activeShop);
    const [discount, setDiscount] = useState({
        productName: "",
        initialPrice: "",
        discountPrice: "",
        percentage: "",
        image: "",
        limitDate: ""
    });
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitLoader, setSubmitLoader] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDiscount((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleProductSelect = (e) => {
        const { value } = e.target;
        const val = JSON.parse(value)
        
        setSelectedProducts((prevProducts) => [...prevProducts, val]);
    };

    const removeSelectedProduct = (product) => {
        setSelectedProducts((prevProducts) =>
            prevProducts.filter((selectedProduct) => selectedProduct !== product)
        );
    };

    const calculateDiscountPercentage = (a, b) => {
        return ((1 - b / a) * 100).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation logic can go here if needed
        try {
            setDisableSubmit(true);
            setSubmitLoader(true);
            const getPercentage = calculateDiscountPercentage(
                discount.initialPrice,
                discount.discountPrice
            );
            const data = {
                productName: discount.productName,
                initialPrice: discount.initialPrice,
                discountPrice: discount.discountPrice,
                percentage: getPercentage,
                image: discount.image,
                limitDate: discount.limitDate,
                shop_id,
                order_details: [{order_details: selectedProducts}]
            };

            console.log(data)
            const response = await axios.post(
                `${API_URL_BASE}/api/discounts/add`,
                data
            );
            if (response.data.created === "ok") {
                setSubmitLoader(false);
                setAux(!aux);
                setTimeout(() => {
                    closeModal();
                    setDisableSubmit(false);
                    setDiscount({
                        initialPrice: "",
                        discountPrice: "",
                        percentage: "",
                        image:
                            "https://res.cloudinary.com/doyafxwje/image/upload/v1704906320/no-photo_yqbhu3.png",
                        limitDate: "",
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

    console.log(selectedProducts)

    return (
        <>
            <div
                className="z-20 fixed top-0 left-0 flex items-center justify-center w-full h-full"
                style={{ background: "rgba(0, 0, 0, 0.70)" }}
            >
                <div>
                    <div className="w-4/5 mx-auto bg-white shadow rounded-lg p-6 md:w-full dark:bg-darkBackground">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-semibold mb-4 text-black dark:text-darkText">
                                Add new discount
                            </h1>
                            <XCircleIcon
                                onClick={closeModal}
                                className="cursor-pointer mt-2 w-5 h-5 hover:scale-125 dark:text-darkText"
                            />
                        </div>
                        <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                <div>
                                    <label className="pl-1  font-bold dark:text-darkText">Product name</label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        name="productName"
                                        value={discount.productName}
                                        placeholder="Product name"
                                        className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                <div>
                                    <label className="pl-1  font-bold dark:text-darkText">
                                        Initial price
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        name="initialPrice"
                                        value={discount.initialPrice}
                                        placeholder="Initial price"
                                        className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                                    />
                                </div>
                                <div>
                                    <label className="pl-1  font-bold dark:text-darkText">
                                        Discounted price
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        name="discountPrice"
                                        value={discount.discountPrice}
                                        placeholder="Discounted price"
                                        className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="pl-1  font-bold dark:text-darkText">
                                    Expiration date
                                </label>
                                <input
                                    onChange={handleChange}
                                    type="date"
                                    name="limitDate"
                                    value={discount.limitDate}
                                    placeholder="Expiration date"
                                    className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                <div className="mr-2">
                                    <div className="mt-2 grid grid-cols-1 place-items-center">
                                        <label className="font-bold dark:text-darkText">
                                            Image link
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            name="image"
                                            value={discount.image}
                                            placeholder="Image link"
                                            className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                                        />
                                    </div>
                                    <div className="mb-2 mt-2 ml-[100px]">
                                        <img
                                            className="w-20 h-20 rounded"
                                            src={discount.image}
                                            alt="product"
                                        />
                                    </div>
                                </div>
                                <div className="ml-2">
                                    <div className="relative pt-2 z-10">
                                        <label className="font-bold dark:text-darkText ml-[100px]">
                                            Selected products
                                        </label>
                                        <div
                                            className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary cursor-pointer"
                                            onClick={() => setIsSelectOpen(!isSelectOpen)}
                                        >
                                            {isSelectOpen ? "Close" : "Open"} Product Select
                                        </div>
                                        {isSelectOpen && (
                                            <select
                                                onChange={handleProductSelect}
                                                value={discount.productName}
                                                className="absolute top-full left-0 right-0 border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                                                style={{ zIndex: 999 }} // Ajusta el z-index para que esté por encima de otros elementos
                                                multiple
                                            >
                                                {products.map((product) => (
                                                    <option
                                                        key={product.id}
                                                        value={JSON.stringify(product)}
                                                        className="z-20"
                                                    >
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                    </div>
                                    <div className="mt-4">

                                        {selectedProducts.map((selectedProduct, index) => (
                                            <span
                                                key={selectedProduct.id}
                                                className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded mr-2 mb-2 inline-block relative z-2"
                                            >
                                                {selectedProduct.name}
                                                <button
                                                    onClick={() => removeSelectedProduct(selectedProduct)}
                                                    className="absolute top-0 right-0 mr-1 mt-1 ml-10 text-xs text-gray-600 dark:text-gray-400 bg-transparent border-none"
                                                >
                                                    x
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center items-center">
                                {!submitLoader ? (
                                    <button
                                        type="submit"
                                        disabled={disableSubmit}
                                        className="mt-2 px-4 py-2 w-fit rounded bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                                    >
                                        Create new discount
                                    </button>
                                ) : (
                                    <Loader />
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateDiscountModal;