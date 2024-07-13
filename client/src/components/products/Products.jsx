import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { changeShop } from '../../redux/actions/actions';
import { PlusCircle, Trash, PencilIcon } from 'lucide-react';
import ProductCards from './product_cards/ProductCards';
import CategoryModal from '../modal/CategoryModal';
import UpDateProductModal from '../modal/UpdateProdModal';
import ProductModal from '../modal/ProductModal';
import ExtrasModal from '../modal/ExtrasModal';
import { getParamsEnv } from "../../functions/getParamsEnv";
import FloatingTutorialCard from '../TutorialCard';
import 'animate.css'; // Importa animate.css

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
  const [showTutorial, setShowTutorial] = useState(true); // Estado para mostrar el tutorial

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
          if (response.data.length > 0) {
            setShowTutorial(false); // Ocultar tutorial si hay categorías
          }
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
    setSelectedProduct({ example: true, name: "Example product", img: "https://res.cloudinary.com/doqyrz0sg/image/upload/v1720302887/no_prod_fp7i7v.png" });
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
    setShowTutorial(false); // Ocultar tutorial al agregar categoría
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
            if (response.data.length > 0) {
              setShowTutorial(false); // Ocultar tutorial si se agrega una categoría
            }
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
        <div className="flex flex-wrap justify-center mt-14 space-x-2 mb-2 items-center">
          {Array.isArray(categories) && categories.length > 0 ? (
            <>
              {categories.map((category) => (
                <div
                  onClick={() => handleIconClick(category.id)}
                  key={category.id}
                  className={`cursor-pointer category flex items-center justify-center mb-2 p-1 rounded-md shadow-sm border transition-colors duration-200 ${
                    category.id === selectedCategory ? 'border-yellow-400' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-xs">{category.name}</span>
                </div>
              ))}
              <div
                className="flex items-center justify-center p-1 rounded-md shadow-sm border border-gray-300 cursor-pointer hover:border-green-400 transition-colors duration-200"
                onClick={handleAddCategory}
              >
                <PlusCircle className="w-4 h-4 mr-1 text-green-500" />
                <p className="text-xs font-semibold text-green-500">Add Category</p>
              </div>
            </>
          ) : (
            <div className="text-center p-4 w-full">
              <div
                className="flex items-center justify-center p-1 rounded-md shadow-sm border border-gray-300 cursor-pointer hover:border-green-400 transition-colors duration-200"
                onClick={handleAddCategory}
              >
                <PlusCircle className="w-4 h-4 mr-1 text-green-500" />
                <p className="text-xs font-semibold text-green-500">Add Category</p>
              </div>
            </div>
          )}
        </div>
        <hr className="my-2 border-t border-gray-300 mx-auto w-1/2" />
      </div>
      <div className="flex pb-5 flex-col bg-gray-200 lg:h-screen lg:pl-[150px] md:flex-row gap-2 md:gap-[20px] p-2">
        {selectedCategory !== null && (
          <div className="bg-gray-100 p-2 rounded-lg shadow-md w-full md:w-[700px] min-h-[400px]">
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
          <div className="bg-white w-full md:w-[200px] h-auto rounded-lg overflow-hidden shadow-lg">
            <img
              src={selectedProduct.img}
              alt={selectedProduct.name}
              className="w-full h-[100px] md:h-[130px] object-cover"
            />
            <div className="px-3 py-2">
              <div className="font-bold text-xs mb-1 text-gray-800">{selectedProduct.name}</div>
              <hr className="my-1 border-gray-300" />
              <p className="text-gray-700 text-xs mt-1 font-serif italic">
                {selectedProduct.description}
              </p>
            </div>
            <div className="px-3 pt-1 pb-2">
              <hr className="my-1 border-gray-300" />
              <p className="text-gray-700 text-xs">Price: ${selectedProduct.price}</p>
              <hr className="my-1 border-gray-300" />
              {!selectedProduct.example && (
                <div>
                  <button
                    className="text-blue-500 hover:text-blue-700 font-bold py-0.5 px-1.5 rounded-full flex items-center text-xs"
                    onClick={() => setShowExtrasModal(true)}
                  >
                    Extras
                  </button>
                  <div className="mt-1 flex justify-end items-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 font-bold py-0.5 px-1.5 rounded-full flex items-center mr-1 text-xs"
                      onClick={openEditProduct}
                    >
                      <PencilIcon className="w-2.5 h-2.5 mr-0.5" />
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 font-bold py-0.5 px-1.5 rounded-full flex items-center text-xs"
                      onClick={DeleteProduct}
                    >
                      <Trash className="w-2.5 h-2.5 mr-0.5" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
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

      {showTutorial && (
        <FloatingTutorialCard onClose={() => setShowTutorial(false)} />
      )}
    </>
  );
}

export default Products;