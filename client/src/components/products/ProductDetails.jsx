import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { changeShop } from '../../redux/actions/actions';
import { ArrowRightIcon, PlusCircle, Trash, PencilIcon } from 'lucide-react';
import ProductCards from './product_cards/ProductCards';
import CategoryModal from '../modal/CategoryModal';
import UpDateProductModal from '../modal/UpdateProdModal';
import ProductModal from '../modal/ProductModal';
import ExtrasModal from '../modal/ExtrasModal';
import { getParamsEnv } from "../../functions/getParamsEnv";

const { API_URL_BASE } = getParamsEnv();

function Products() {
  const activeShop = useSelector((state) => state.activeShop);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.client.token);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddCategory, setshowAddCategory] = useState(false);
  const [products, setProducts] = useState([]);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState({
    name: '',
    price: '',
    description: '',
    img: '',
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    local_id: activeShop,
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    stock: 0,
    category_id: selectedCategory,
    img: null,
  });
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [aux, setAux] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  console.log(selectedCategory, "categoria");
  console.log(selectedProduct, "productoelegido");
  dispatch(changeShop(activeShop));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL_BASE}/api/categories/get/${activeShop}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Error: La respuesta de categorías no es un array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [activeShop]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL_BASE}/api/products/get/${selectedCategory}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      }
    };

    if (selectedCategory !== null) {
      fetchData();
    }
  }, [selectedCategory, aux]);

  const handleIconClick = (categoryId) => {
    setSelectedProduct(null);
    setSelectedCategory(categoryId);
  };

  const handleCardClick = (productId) => {
    if (selectedProduct?.id === productId) {
      setShowDetails(!showDetails);
    } else {
      setSelectedProduct(products.find(product => product.id === productId));
      setShowDetails(true);
    }
  };

  const handleAddCategory = () => {
    setshowAddCategory(true);
  };

  const handleCreateCategory = () => {
    axios
      .post(`${API_URL_BASE}/api/categories/add`, newCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setNewCategory({
          name: '',
          local_id: activeShop,
        });
        setshowAddCategory(false);

        axios
          .get(`${API_URL_BASE}/api/categories/get/${activeShop}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setCategories(response.data);
          })
          .catch((error) => {
            console.error('Error al obtener categorías actualizadas:', error);
          });
      })
      .catch((error) => {
        console.error('Error al crear la categoría:', error);
      });
  };

  const openEditProduct = () => {
    setShowUpdateProduct(true);
  };

  const DeleteProduct = () => {
    const id = selectedProduct.id;
    const userConfirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar este producto?'
    );

    if (userConfirmed) {
      axios
        .delete(`${API_URL_BASE}/api/products/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          axios
            .get(`${API_URL_BASE}/api/products/get/${selectedCategory}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              setProducts(response.data);
            })
            .catch((error) => {
              console.error('Error al obtener productos actualizados:', error);
            });
        })
        .catch((error) => {
          console.error('Error al eliminar producto:', error);
        });
      setSelectedProduct(null);
    }
  };

  const handleUpdateProduct = (editedProduct) => {
    setShowUpdateProduct(false);
    const updatedFields = {
      name: editedProduct.name || selectedProduct.name,
      price: editedProduct.price || selectedProduct.price,
      description: editedProduct.description || selectedProduct.description,
      img: editedProduct.img || selectedProduct.img,
    };

    const hasChanged = Object.keys(updatedFields).some(
      (field) => updatedFields[field] !== selectedProduct[field]
    );

    if (!hasChanged) {
      console.log('No fields changed');
      return;
    }

    axios
      .put(
        `${API_URL_BASE}/api/products/update/${selectedProduct.id}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSelectedProduct((prevSelectedProduct) => ({
          ...prevSelectedProduct,
          ...updatedFields,
        }));

        axios
          .get(`${API_URL_BASE}/api/products/get/${selectedCategory}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setProducts(response.data);
          })
          .catch((error) => {
            console.error('Error fetching updated products:', error);
          });
      })
      .catch((error) => {
        console.error('Error updating the product:', error);
      });
  };

  const handleSaveExtras = (editedExtras) => {
    const updatedProduct = { ...selectedProduct, extras: editedExtras };
    setSelectedProduct(updatedProduct);

    axios
      .put(
        `${API_URL_BASE}/api/products/update-extras`,
        { extras: editedExtras, productId: selectedProduct.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )
      .then((response) => {
        setSelectedProduct(response.data);

        axios
          .get(`${API_URL_BASE}/api/products/get/${selectedCategory}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setProducts(response.data);
          })
          .catch((error) => {
            console.error('Error fetching updated products:', error);
          });
      })
      .catch((error) => {
        console.error('Error updating extras:', error);
      });
  };

  return (
    <>
      <div className="pb-2 text-center mt-10">
        <h3 className="text-sm md:text-base font-bold mt-2 text-gray-800">Products</h3>
        <div className="flex flex-wrap justify-center space-x-2 mb-2">
          {Array.isArray(categories) && categories.map((category, index) => (
            <div
              onClick={() => handleIconClick(category.id)}
              key={category.id}
              className={`cursor-pointer category flex items-center justify-between mb-2 hover:bg-gray-700 transition-colors duration-200 p-1 rounded-lg ${category.id === selectedCategory ? 'border-yellow-500' : 'text-black'}
                } ${index !== categories.length - 1 ? 'border-b border-gray-600 pb-1' : ''}`}
              style={{ fontWeight: category.id === selectedCategory ? 'bold' : 'normal' }}
            >
              <span className="text-xs">{category.name}</span>
            </div>
          ))}
          <div
            className="hover:text-green-500 flex items-center mt-1 rounded-md px-2 py-1 cursor-pointer"
            onClick={handleAddCategory}
          >
            <PlusCircle className="w-3 h-3 mr-1" />
            <p className="text-xs">Add Category</p>
          </div>
        </div>
        <hr className="my-2 border-t border-gray-300 mx-auto w-1/2" />
      </div>
      <div className="flex pb-5 md:ml-20 flex-col bg-gray-200 lg:h-screen lg:pl-[150px] md:flex-row gap-2 md:gap-[20px] p-2">
        {selectedCategory !== null && (
          <div className="bg-gray-100 p-2 rounded-lg shadow-md w-full md:w-[800px] min-h-[600px]">
            <ProductCards
              selectedCategory={selectedCategory}
              products={products}
              setProducts={setProducts}
              setSelectedCategory={setSelectedCategory}
              setCategories={setCategories}
              category_id={selectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleCardClick={handleCardClick}
              selectedProduct={selectedProduct}
              setShowNewProductModal={setShowNewProductModal}
              showDetails={showDetails}
            />
          </div>
        )}

        {selectedProduct && (
          <div className="bg-white w-full md:w-[300px] h-auto rounded-lg overflow-hidden shadow-lg">
            <img
              src={selectedProduct.img}
              alt={selectedProduct.name}
              className="w-full h-[120px] md:h-[150px] object-cover"
            />
            <div className="px-3 py-2">
              <div className="font-bold text-lg mb-2 text-gray-800">{selectedProduct.name}</div>
              <hr className="my-1 border-gray-300" />
              <p className="text-gray-700 text-xs mt-2 font-serif italic">
                {selectedProduct.description}
              </p>
            </div>
            <div className="px-3 pt-1 pb-2">
              <hr className="my-1 border-gray-300" />
              <p className="text-gray-700 text-xs">Price: ${selectedProduct.price}</p>
              <hr className="my-1 border-gray-300" />
              <button
                className="text-blue-500 hover:text-blue-700 font-bold py-1 px-2 rounded-full flex items-center"
                onClick={() => setShowExtrasModal(true)}
              >
                Extras
              </button>
              <div className="mt-1 flex justify-end items-center">
                <button
                  className="text-blue-500 hover:text-blue-700 font-bold py-1 px-2 rounded-full flex items-center mr-1"
                  onClick={openEditProduct}
                >
                  <PencilIcon className="w-3 h-3 mr-1" />
                  Edit
                </button>
                <button
                  className="text-red-500 hover:text-red-700 font-bold py-1 px-2 rounded-full flex items-center"
                  onClick={DeleteProduct}
                >
                  <Trash className="w-3 h-3 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <CategoryModal
          show={showAddCategory}
          handleClose={() => {
            setNewCategory({
              name: '',
              local_id: activeShop,
            });
            setshowAddCategory(false);
          }}
          handleSubmit={handleCreateCategory}
          newCategory={newCategory}
          handleInputChange={(e) => {
            const { name, value } = e.target;
            setNewCategory({
              ...newCategory,
              [name]: value,
            });
          }}
          local_id={activeShop}
        />
        <UpDateProductModal
          selectedProduct={selectedProduct}
          show={showUpdateProduct}
          handleClose={() => {
            setShowUpdateProduct(false);
            setProductToUpdate({
              name: '',
              price: '',
              description: '',
              img: '',
            });
          }}
          handleUpdate={handleUpdateProduct}
          aux={aux}
          setAux={setAux}
        />

        <ProductModal
          setNewCategory={setNewProduct}
          show={showNewProductModal}
          handleClose={() => setShowNewProductModal(false)}
          category_id={selectedCategory}
          setNewProduct={setNewProduct}
          selectedCategory={selectedCategory}
          setProducts={setProducts}
          setShowNewProductModal={setShowNewProductModal}
        />

        <ExtrasModal
          show={showExtrasModal}
          handleClose={() => setShowExtrasModal(false)}
          extras={selectedProduct?.extras || []}
          handleSaveExtras={handleSaveExtras}
        />
      </div>
    </>
  );
}

export default Products;