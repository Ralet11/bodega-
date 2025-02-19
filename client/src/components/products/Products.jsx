import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { changeShop } from '../../redux/actions/actions';
import { PlusCircle, Trash, PencilIcon } from 'lucide-react';
import ProductSkeletonLoader from '../ProductSkeleton';
import CategoryModal from '../modal/CategoryModal';
import EditProductModal from '../modal/UpdateProdModal';
import ProductModal from '../modal/ProductModal';
import ExtrasModal from '../modal/ExtrasModal';
import { getParamsEnv } from '../../functions/getParamsEnv';
import CreateDiscountModal from '../modal/CreateDiscountModal';
import 'animate.css';
import TutorialCard from '../TutorialCard';

const colors = {
  primary: '#FFB74D',
  textPrimary: '#000000',
  textSecondary: '#FFFFFF',
  highlight: '#FFA726',
  border: '#BDBDBD',
  danger: '#E57373',
  purple: '#BA68C8', // Purple color for the star
};

const { API_URL_BASE } = getParamsEnv();

function Products() {
  const activeShop = useSelector((state) => state.activeShop);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.client.token);
  const client = useSelector((state) => state?.client.client);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [aux, setAux] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', local_id: activeShop });
  const [activeTab, setActiveTab] = useState('products');
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [selectedProductForDiscount, setSelectedProductForDiscount] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [hasCreatedCategory, setHasCreatedCategory] = useState(false);
  const totalSteps = 2;

  const tutorialSteps = [
    {
      text: 'To get started, you can create a category where you will later include products.',
      icon: <PlusCircle className="w-6 h-6 text-amber-600" />,
    },
    {
      text: 'Now you can add products with discounts to set up your shop.',
      icon: <PlusCircle className="w-6 h-6 text-amber-600" />,
    },
  ];

  const iconPositions = {
    0: { top: '5%', left: '20%' },
    1: { top: '5%', left: '60%' },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await axios.get(`${API_URL_BASE}/api/categories/get/${activeShop}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          setCategories(response.data);
          if (response.data.length > 0) {
            setSelectedCategory(response.data[0].id);
            setHasCreatedCategory(true);
            setShowTutorial(false);
          } else {
            setSelectedCategory(null);
            setShowTutorial(true);
          }
        } else {
          console.error('Error: Categories response is not an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [activeShop, token]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory !== null) {
        setIsLoadingProducts(true);
        try {
          const response = await axios.get(`${API_URL_BASE}/api/products/get/${selectedCategory}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (Array.isArray(response.data)) {
            setProducts(response.data);
            const updatedProduct = response.data.find(
              (product) => product.id === selectedProduct?.id
            );
            setSelectedProduct(updatedProduct || null);
          } else {
            console.error('Error: Products response is not an array.');
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setIsLoadingProducts(false);
        }
      } else {
        setProducts([]);
        setSelectedProduct(null);
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, token, aux]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      if (selectedCategory !== null) {
        try {
          const response = await axios.get(
            `${API_URL_BASE}/api/discounts/getByCat/${selectedCategory}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (Array.isArray(response.data)) {
            setDiscounts(response.data);
            if (response.data.length > 0) {
              setSelectedDiscount(response.data[0]);
            } else {
              setSelectedDiscount(null);
            }
          } else {
            console.error('Error: Discounts response is not an array.');
          }
        } catch (error) {
          console.error('Error fetching discounts:', error);
        }
      } else {
        setDiscounts([]);
        setSelectedDiscount(null);
      }
    };
    if (activeTab === 'discounts') {
      fetchDiscounts();
    }
  }, [selectedCategory, token, activeTab, aux]);

  useEffect(() => {
    if (activeTab !== 'products') {
      setSelectedProduct(null);
    }
    if (activeTab !== 'discounts') {
      setSelectedDiscount(null);
    }
  }, [activeTab]);

  const handleDeleteDiscount = async (discountId) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        await axios.delete(`${API_URL_BASE}/api/discounts/delete/${discountId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Discount deleted');
        setAux(!aux);
      } catch (error) {
        console.error('Error deleting discount:', error);
      }
    }
  };

  const handleIconClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedProduct(null);
    setSelectedDiscount(null);
  };

  const handleCardClick = (itemId) => {
    if (activeTab === 'products') {
      if (selectedProduct?.id === itemId) {
        setShowDetails(!showDetails);
      } else {
        setSelectedProduct(products.find((product) => product.id === itemId));
        setShowDetails(true);
      }
    } else if (activeTab === 'discounts') {
      if (selectedDiscount?.id === itemId) {
        setShowDetails(!showDetails);
      } else {
        setSelectedDiscount(discounts.find((discount) => discount.id === itemId));
        setShowDetails(true);
      }
    }
  };

  const handleAddCategory = () => {
    setShowAddCategory(true);
  };

  const handleCreateCategory = async () => {
    try {
      await axios.post(`${API_URL_BASE}/api/categories/add`, newCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddCategory(false);
      const response = await axios.get(`${API_URL_BASE}/api/categories/get/${activeShop}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
      if (response.data.length === 1) {
        setHasCreatedCategory(true);
        setSelectedCategory(response.data[0].id);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const openEditProduct = () => {
    setShowUpdateProduct(true);
  };

  const handleDeleteCategory = (categoryId) => {
    const confirmDeleteCategory = window.confirm('Are you sure you want to delete this category?');

    if (confirmDeleteCategory) {
      axios
        .delete(`${API_URL_BASE}/api/categories/hide/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log('Category deleted:', response.data);
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== categoryId)
          );

          if (selectedCategory === categoryId) {
            setSelectedCategory(null);
          }
        })
        .catch((error) => {
          console.error('Error deleting category:', error);
        });
    }
  };

  const deleteProduct = async () => {
    const id = selectedProduct.id;
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL_BASE}/api/products/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const response = await axios.get(`${API_URL_BASE}/api/products/get/${selectedCategory}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
        setSelectedProduct(null);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUpdateProduct = async (editedProduct) => {
    try {
      // Preparamos el cuerpo que enviaremos al backend
      const updatedData = {
        productId: selectedProduct.id,
        name: editedProduct.name,
        price: parseFloat(editedProduct.priceToSell),           // El precio final tras el descuento
        description: editedProduct.description,
        category_id: selectedProduct.categories_id,
        discountPercentage: parseInt(editedProduct.discountPercentage) || 0,
        extras: editedProduct.modifiers.map((modifier) => ({
          id: modifier.id,
          name: modifier.name,
          required: modifier.required,
          onlyOne: !modifier.multipleSelect,
          options: modifier.options.map((option) => ({
            id: option.id,
            name: option.name,
            price: parseFloat(option.price),
          })),
        })),
      };
  
      // Si hay imagen nueva, dejamos updatedData.img como string vacío, 
      // para que se sobreescriba en el backend (o al menos avisar que se reemplazará)
      if (editedProduct.image) {
        updatedData.img = '';
      }
  
      // Si hay promoción "Buy To Win"
      if (editedProduct.promotionEnabled) {
        updatedData.promotion = {
          clientId: client.id,        // O donde guardes el ID del cliente
          productId: selectedProduct.id,
          promotionTypeId: 1,         // ID hardcodeado de 'Buy To Win' (ejemplo)
          localId: activeShop,
          quantity: editedProduct.promotionQuantity,
        };
      } else {
        updatedData.promotion = null; // Indica que no hay promoción
      }
  
      // Enviamos los datos al nuevo endpoint (sin "discount" en la ruta)
      await axios.put(
        `${API_URL_BASE}/api/products/update-product`, 
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Subimos la imagen del producto (si fue seleccionada)
      if (editedProduct.image) {
        const formData = new FormData();
        formData.append('id', selectedProduct.id.toString());
        formData.append('action', 'product');
        formData.append('img', editedProduct.image);
  
        await axios.post(`${API_URL_BASE}/api/up-image/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
  
      // Refrescamos la lista de productos
      const response = await axios.get(
        `${API_URL_BASE}/api/products/get/${selectedCategory}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedProducts = response.data;
      setProducts(updatedProducts);
  
      // Buscamos el producto recién actualizado en la lista
      const updatedProduct = updatedProducts.find(
        (p) => p.id === selectedProduct.id
      );
      setSelectedProduct(updatedProduct || null);
      setShowUpdateProduct(false);
    } catch (error) {
      console.error('Error updating the product:', error);
    }
  };
  

  const handleSaveExtras = async (editedExtras) => {
    try {
      const updatedProduct = { ...selectedProduct, extras: editedExtras };
      await axios.put(
        `${API_URL_BASE}/api/products/update-extras`,
        {
          extras: editedExtras,
          productId: selectedProduct.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedProduct(updatedProduct);
      const response = await axios.get(`${API_URL_BASE}/api/products/get/${selectedCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error updating extras:', error);
    }
  };

  const handleNextStep = () => {
    if (tutorialStep < totalSteps - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gray-100 lg:px-20 py-5 overflow-y-auto">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 lg:p-10 overflow-y-auto max-h-screen">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200"
                onClick={handleAddCategory}
              >
                <PlusCircle className="w-3 h-3" />
                <span>Add Category</span>
              </button>
              {selectedCategory && (
                <button
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  onClick={() => handleDeleteCategory(selectedCategory)}
                >
                  <Trash className="w-3 h-3" />
                  <span>Delete Category</span>
                </button>
              )}
            </div>
          </div>

          {isLoadingCategories ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    category.id === selectedCategory
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleIconClick(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div className="text-center text-gray-500 mb-4">No categories found.</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-8 w-24 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>
          )}

          <hr className="my-4 border-t border-gray-200 w-full" />

          <div className="flex flex-col lg:flex-row gap-4">
            {selectedCategory !== null && (
              <div className="flex-1 p-4 rounded-lg shadow-md bg-gray-50">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 space-y-2 lg:space-y-0 lg:space-x-4">
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full lg:w-auto border border-gray-300 rounded-md px-4 py-2"
                  />
                  <button
                    onClick={() => setShowNewProductModal(true)}
                    className="w-full lg:w-auto flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold rounded-full bg-amber-500 text-white hover:bg-amber-600 transition duration-200"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                {isLoadingProducts ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <ProductSkeletonLoader key={index} />
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {products
                      .filter((product) =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((product) => (
                        <div
                          key={product.id}
                          className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 ${
                            selectedProduct?.id === product.id ? 'ring-2 ring-amber-500' : ''
                          }`}
                          onClick={() => handleCardClick(product.id)}
                        >
                          <div className="relative">
                            <img
                              src={product.img}
                              alt={product.name}
                              className="w-full h-24 lg:h-32 object-cover"
                            />
                          </div>
                          <div className="p-2 lg:p-4">
                            <h3 className="text-sm lg:text-base font-medium truncate">
                              {product.name}
                            </h3>
                            <div className="flex items-center space-x-1">
                              <p className="text-xs lg:text-sm text-amber-600 font-semibold">
                                ${product.price}
                              </p>
                              {/* Display smaller purple star next to price if product has promotions */}
                              {product.promotions && product.promotions.length > 0 && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 text-purple-600"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 .587l3.668 7.568L24 9.423l-6 5.858L19.335 24 12 19.771 4.665 24 6 15.281 0 9.423l8.332-1.268L12 .587z" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div>
                    <div className="text-center text-gray-500 mb-4">No products found.</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <ProductSkeletonLoader key={index} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedProduct && !isLoadingProducts && activeTab === 'products' && (
              <div className="w-full lg:w-[300px] bg-white p-4 rounded-lg shadow-lg">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <div className="mb-4">
                  <div className="font-bold text-lg mb-2 text-gray-800">
                    {selectedProduct.name}
                  </div>
                  <p className="text-gray-700 mb-2">{selectedProduct.description}</p>
                  <div className="flex items-center space-x-1">
                    <p className="font-semibold text-gray-800">${selectedProduct.price}</p>
                    {/* Display smaller purple star next to price if product has promotions */}
                    {selectedProduct.promotions && selectedProduct.promotions.length > 0 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.858L19.335 24 12 19.771 4.665 24 6 15.281 0 9.423l8.332-1.268L12 .587z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    className="flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md transition-colors duration-200 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                    onClick={openEditProduct}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md transition-colors duration-200 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={deleteProduct}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {selectedDiscount && !isLoadingProducts && activeTab === 'discounts' && (
              <div className="w-full lg:w-[300px] bg-white p-6 rounded-xl shadow-lg relative">
                <div className="mb-4 relative">
                  <img
                    src={selectedDiscount.img}
                    alt={selectedDiscount.productName}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full shadow-lg bg-amber-500 text-white">
                    {selectedDiscount.percentage}% OFF
                  </span>
                </div>
                <div className="text-left mb-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">
                    {selectedDiscount.productName}
                  </h2>
                  <div className="text-sm mb-2 text-gray-700">
                    Applies to:
                    <span className="block text-base font-medium">
                      {selectedDiscount.productName}
                    </span>
                  </div>
                  <div className="text-xs mt-4">
                    <p>Valid until:</p>
                    <p className="font-semibold text-red-600">
                      {new Date(selectedDiscount.limitDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex justify-start space-x-2">
                  <button
                    className="flex items-center space-x-2 px-3 py-1 text-xs font-medium rounded-lg transition-colors duration-200 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => handleDeleteDiscount(selectedDiscount.id)}
                  >
                    <Trash className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CategoryModal
        show={showAddCategory}
        handleClose={() => setShowAddCategory(false)}
        handleSubmit={handleCreateCategory}
        handleInputChange={handleInputChange}
        newCategory={newCategory}
      />
      <EditProductModal
        selectedProduct={selectedProduct}
        show={showUpdateProduct}
        handleClose={() => setShowUpdateProduct(false)}
        handleUpdate={handleUpdateProduct}
        activeShop={activeShop}
        clientId={client.id}
      />
      <ProductModal
        show={showNewProductModal}
        handleClose={() => setShowNewProductModal(false)}
        selectedCategory={selectedCategory || 0}
        setProducts={setProducts}
        setShowNewProductModal={setShowNewProductModal}
        token={token}
        activeShop={activeShop}
      />
      <ExtrasModal
        show={showExtrasModal}
        handleClose={() => setShowExtrasModal(false)}
        extras={selectedProduct?.extras || []}
        handleSaveExtras={handleSaveExtras}
      />
      <CreateDiscountModal
        show={showAddDiscountModal}
        handleClose={() => setShowAddDiscountModal(false)}
        aux={aux}
        setAux={setAux}
        product={selectedProductForDiscount}
      />
      {showTutorial && (
        <TutorialCard
          step={tutorialStep}
          totalSteps={totalSteps}
          onNextStep={handleNextStep}
          onCloseTutorial={handleCloseTutorial}
          iconPositions={iconPositions}
          tutorialSteps={tutorialSteps}
          isStepReady={hasCreatedCategory}
        />
      )}
    </div>
  );
}

export default Products;
