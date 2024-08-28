import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { changeShop } from '../../redux/actions/actions';
import { PlusCircle, Trash, PencilIcon } from 'lucide-react';
import ProductCards from './product_cards/ProductCards';
import DiscountCards from './product_cards/DiscountCards';
import ProductSkeletonLoader from '../ProductSkeleton';
import CategoryModal from '../modal/CategoryModal';
import UpDateProductModal from '../modal/UpdateProdModal';
import ProductModal from '../modal/ProductModal';
import ExtrasModal from '../modal/ExtrasModal';
import { getParamsEnv } from "../../functions/getParamsEnv";
import FloatingTutorialCard from '../TutorialCard';
import CreateDiscountModal from '../modal/CreateDiscountModal';
import 'animate.css';

const { API_URL_BASE } = getParamsEnv();

function Products() {
  const activeShop = useSelector((state) => state.activeShop);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.client.token);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null); // Para descuentos
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]); // Para descuentos
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showNewDiscountModal, setShowNewDiscountModal] = useState(false); // Para descuentos
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [aux, setAux] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', local_id: activeShop });
  const [activeTab, setActiveTab] = useState('products');
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [selectedProductForDiscount, setSelectedProductForDiscount] = useState(null);

  dispatch(changeShop(activeShop));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/categories/get/${activeShop}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          setCategories(response.data);
          if (response.data.length > 0) {
            setSelectedCategory(response.data[0].id);
            setShowTutorial(false);
          }
        } else {
          console.error('Error: La respuesta de categorías no es un array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCategories();
  }, [activeShop, token]);

  const handleDeleteDiscount = async (discountId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este descuento?')) {
      try {
        await axios.delete(`${API_URL_BASE}/api/discounts/delete/${discountId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const response = await axios.get(`${API_URL_BASE}/api/discounts/get/${selectedCategory}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDiscounts(response.data);
        setSelectedDiscount(null); // Clear the selected discount after deletion
      } catch (error) {
        console.error('Error al eliminar el descuento:', error);
      }
    }
  };

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
            if (response.data.length > 0) {
              setSelectedProduct(response.data[0]);
            }
          } else {
            console.error('Error: La respuesta de productos no es un array.');
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setIsLoadingProducts(false);
        }
      }
    };
    fetchProducts();
  }, [selectedCategory, token]);

  console.log(discounts, "des")

  // Effect to fetch discounts
  useEffect(() => {
    const fetchDiscounts = async () => {
      if (selectedCategory !== null) {
        try {
          const response = await axios.get(`${API_URL_BASE}/api/discounts/getByCat/${selectedCategory}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (Array.isArray(response.data)) {
            setDiscounts(response.data);
            if (response.data.length > 0) {
              setSelectedDiscount(response.data[0]);
            }
          } else {
            console.error('Error: La respuesta de descuentos no es un array.');
          }
        } catch (error) {
          console.error('Error fetching discounts:', error);
        }
      }
    };
    if (activeTab === 'discounts') {
      fetchDiscounts();
    }
  }, [selectedCategory, token, activeTab]);

  // Effect to clear the selected product or discount when the tab changes
  useEffect(() => {
    if (activeTab !== 'products') {
      setSelectedProduct(null);
    }
    if (activeTab !== 'discounts') {
      setSelectedDiscount(null);
    }
  }, [activeTab]);

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
        setSelectedProduct(products.find(product => product.id === itemId));
        setShowDetails(true);
      }
    } else if (activeTab === 'discounts') {
      if (selectedDiscount?.id === itemId) {
        setShowDetails(!showDetails);
      } else {
        setSelectedDiscount(discounts.find(discount => discount.id === itemId));
        setShowDetails(true);
      }
    }
  };

  const handleAddCategory = () => {
    setShowAddCategory(true);
    setShowTutorial(false);
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
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0].id);
      }
    } catch (error) {
      console.error('Error al crear la categoría:', error);
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
    const confirmDeleteCategory = window.confirm('¿Estás seguro que quieres borrar la categoría?');

    if (confirmDeleteCategory) {
      axios.delete(`${API_URL_BASE}/api/categories/hide/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        console.log('Categoría eliminada:', response.data);
        setCategories(prevCategories =>
          prevCategories.filter(category => category.id !== categoryId)
        );

        if (selectedCategory === categoryId) {
          setSelectedCategory(null);
        }
      }).catch((error) => {
        console.error('Error al eliminar la categoría:', error);
      });
    }
  };

  const deleteProduct = async () => {
    const id = selectedProduct.id;
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
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
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const handleUpdateProduct = async (editedProduct) => {
    try {
      const updatedFields = {
        ...selectedProduct,
        ...editedProduct,
      };
      await axios.put(`${API_URL_BASE}/api/products/update/${selectedProduct.id}`, updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowUpdateProduct(false);
      const response = await axios.get(`${API_URL_BASE}/api/products/get/${selectedCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error updating the product:', error);
    }
  };

  const handleSaveExtras = async (editedExtras) => {
    try {
      const updatedProduct = { ...selectedProduct, extras: editedExtras };
      await axios.put(`${API_URL_BASE}/api/products/update-extras`, {
        extras: editedExtras,
        productId: selectedProduct.id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProduct(updatedProduct);
      const response = await axios.get(`${API_URL_BASE}/api/products/get/${selectedCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error updating extras:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full h-full p-4">
      <div className="w-full max-w-6xl mt-20">
        <div className="pb-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-500 font-semibold border border-blue-500 rounded-md bg-transparent hover:bg-blue-500 hover:text-white transition-colors duration-200"
                onClick={handleAddCategory}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Category</span>
              </button>
              <button
                className="flex items-center space-x-1 px-2 py-1 text-xs text-red-500 font-semibold border border-red-500 rounded-md bg-transparent hover:bg-red-500 hover:text-white transition-colors duration-200"
                onClick={() => handleDeleteCategory(selectedCategory)}
              >
                <Trash className="w-4 h-4" />
                <span>Delete Category</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`cursor-pointer p-2 border rounded-md shadow-sm transition-colors duration-200 ${
                  category.id === selectedCategory ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleIconClick(category.id)}
              >
                <span className="text-sm">{category.name}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-2 py-1 rounded-l-full border text-xs ${
                activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('discounts')}
              className={`px-2 py-1 rounded-r-full border text-xs ${
                activeTab === 'discounts' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'
              }`}
            >
              Discounts
            </button>
          </div>
          <hr className="my-4 border-t border-gray-300 mx-auto w-full" />
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          {selectedCategory !== null && (
            <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md">
              {isLoadingProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ProductSkeletonLoader key={index} />
                  ))}
                </div>
              ) : (
                activeTab === 'products' ? (
                  <ProductCards
                    selectedCategory={selectedCategory}
                    products={products}
                    setProducts={setProducts}
                    setSelectedCategory={setSelectedCategory}
                    setCategories={setCategories}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleCardClick={handleCardClick}
                    selectedProduct={selectedProduct}
                    setShowNewProductModal={setShowNewProductModal}
                    showDetails={showDetails}
                  />
                ) : (
                  <DiscountCards
                    selectedCategory={selectedCategory}
                    discounts={discounts}
                    setDiscounts={setDiscounts}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleCardClick={handleCardClick}
                    selectedDiscount={selectedDiscount}
                    setShowNewDiscountModal={setShowNewDiscountModal}
                  />
                )
              )}
            </div>
          )}
          {selectedProduct && !isLoadingProducts && activeTab === 'products' && (
            <div className="flex-none w-full lg:w-[300px] bg-white p-4 rounded-lg shadow-lg">
              <img
                src={selectedProduct.img}
                alt={selectedProduct.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="mb-4">
                <div className="font-bold text-lg mb-2">{selectedProduct.name}</div>
                <p className="text-gray-700 mb-2">{selectedProduct.description}</p>
                <p className="text-gray-900 font-semibold">${selectedProduct.price}</p>
              </div>
              <div className="flex space-x-1">
                <button
                  className="flex items-center space-x-1 px-1.5 py-0.5 text-xs text-blue-500 font-medium border border-blue-500 rounded-md bg-transparent hover:bg-blue-500 hover:text-white transition-colors duration-200"
                  onClick={openEditProduct}
                >
                  <PencilIcon className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  className="flex items-center space-x-1 px-1.5 py-0.5 text-xs text-red-500 font-medium border border-red-500 rounded-md bg-transparent hover:bg-red-500 hover:text-white transition-colors duration-200"
                  onClick={deleteProduct}
                >
                  <Trash className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  className="flex items-center space-x-1 px-1.5 py-0.5 text-xs text-blue-500 font-medium border border-blue-500 rounded-md bg-transparent hover:bg-blue-500 hover:text-white transition-colors duration-200"
                  onClick={() => setShowExtrasModal(true)}
                >
                  <span>Extras</span>
                </button>
                <button
                  className="flex items-center space-x-1 px-1.5 py-0.5 text-xs text-green-500 font-medium border border-green-500 rounded-md bg-transparent hover:bg-green-500 hover:text-white transition-colors duration-200"
                  onClick={() => {
                    setSelectedProductForDiscount(selectedProduct);
                    setShowAddDiscountModal(true);
                  }}
                >
                  <span>Add Discount</span>
                </button>
              </div>
            </div>
          )}
          {selectedDiscount && !isLoadingProducts && activeTab === 'discounts' && (
            <div className="flex-none w-full lg:w-[300px] bg-white p-4 rounded-lg shadow-lg">
  <img
    src={selectedDiscount.img}
    alt={selectedDiscount.name}
    className="w-full h-40 object-cover rounded-lg mb-4"
  />
  <div className="mb-4">
    <div className="font-bold text-xl text-gray-900 mb-2 flex items-center">
      <span>{selectedDiscount.name}</span>
      <span className="ml-auto bg-green-500 text-white text-sm font-semibold px-2 py-1 rounded-md">
        {selectedDiscount.percentage}% OFF
      </span>
    </div>
    <div className="text-gray-700 mb-2">
      <p className="text-base font-medium">Applies to:</p>
      <p className="text-lg text-gray-900 font-semibold">{selectedDiscount.productName}</p>
    </div>
  </div>
  <div className="flex space-x-1">
    <button
      className="flex items-center space-x-1 px-1.5 py-0.5 text-xs text-red-500 font-medium border border-red-500 rounded-md bg-transparent hover:bg-red-500 hover:text-white transition-colors duration-200"
      onClick={() => handleDeleteDiscount(selectedDiscount.id)}
    >
      <Trash className="w-3.5 h-3.5" />
      <span>Delete</span>
    </button>
  </div>
</div>
          )}
        </div>
      </div>
      <CategoryModal
        show={showAddCategory}
        handleClose={() => setShowAddCategory(false)}
        handleSubmit={handleCreateCategory}
        handleInputChange={handleInputChange}
        newCategory={newCategory}
      />
      <UpDateProductModal
        selectedProduct={selectedProduct}
        show={showUpdateProduct}
        handleClose={() => setShowUpdateProduct(false)}
        handleUpdate={handleUpdateProduct}
        aux={aux}
        setAux={setAux}
      />
      <ProductModal
        show={showNewProductModal}
        handleClose={() => setShowNewProductModal(false)}
        selectedCategory={selectedCategory || 0}
        setProducts={setProducts}
        setShowNewProductModal={setShowNewProductModal}
      />
      <ExtrasModal
        show={showExtrasModal}
        handleClose={() => setShowExtrasModal(false)}
        extras={selectedProduct?.extras || []}
        handleSaveExtras={handleSaveExtras}
      />
      {showTutorial && <FloatingTutorialCard onClose={() => setShowTutorial(false)} />}
      <CreateDiscountModal
        show={showAddDiscountModal}
        handleClose={() => setShowAddDiscountModal(false)}
        aux={aux}
        setAux={setAux}
        product={selectedProductForDiscount} // Pasar el producto seleccionado
      />
    </div>
  );
}

export default Products;
