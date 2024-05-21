import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { changeShop } from '../../redux/actions/actions';
import { ArrowRightIcon, PlusCircle, Trash, PencilIcon } from 'lucide-react';
import ProductCards from './product_cards/ProductCards';
import CategoryModal from '../modal/CategoryModal';
import UpDateProductModal from '../modal/UpdateProdModal';
import ProductModal from '../modal/ProductModal';
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

  console.log(selectedCategory, "categoria");
  console.log(newProduct);
  dispatch(changeShop(activeShop));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL_BASE}/api/categories/get/${activeShop}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );

        console.log(response, "respuesta");
        // Asegúrate de que la respuesta es un array antes de establecerlo en el estado
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
        }
        );

        // Asegúrate de que la respuesta es un array antes de establecerlo en el estado
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
  }, [selectedCategory]);

  const handleIconClick = (categoryId) => {
    console.log(categoryId, "id categoria");
    setSelectedProduct(null);
    setSelectedCategory(categoryId);
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
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

  const handleUpdateProduct = () => {
    setShowUpdateProduct(false);
    const updatedFields = {
      name: productToUpdate.name || selectedProduct.name,
      price: productToUpdate.price || selectedProduct.price,
      description: productToUpdate.description || selectedProduct.description,
      img: productToUpdate.img || selectedProduct.img,
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

  const handleImageUpload = async (productId) => {
    if (newProduct.img) {
      const formData = new FormData();
      formData.append('id', productId);
      formData.append('action', 'product');
      formData.append('image', newProduct.img);
      console.log(formData);

      try {
        const response = await axios.post(`${API_URL_BASE}/api/up-image/`, formData,
          {
            headers:
            {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.status === 200) {
          console.log('Image uploaded successfully');
        } else {
          console.error('Error uploading image');
        }
        window.alert("image updated");
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleCreateProduct = async () => {
    console.log("papapa");
    // Actualiza el category_id en newProduct con el valor seleccionado
    const updatedNewProduct = {
      ...newProduct,
      category_id: selectedCategory,
    };
    console.log(selectedCategory);
    console.log(newProduct);
    try {
      const response = await axios.post(
        `${API_URL_BASE}/api/products/add`,
        updatedNewProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } // Utiliza updatedNewProduct en lugar de newProduct
      );
      console.log('Producto creado:', response.data);

      // Actualiza la lista de productos después de crear uno nuevo
      const updatedProductsResponse = await axios.get(
        `${API_URL_BASE}/api/products/get/${selectedCategory}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      handleImageUpload(response.data.id);

      setNewProduct({
        name: '',
        price: 0,
        description: '',
        stock: 0,
        category_id: selectedCategory,
        img: "", // Restaura el valor inicial de category_id si es necesario
      });

      setProducts(updatedProductsResponse.data);
      setShowNewProductModal(false);
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col bg-gray-100 lg:h-screen lg:mt-20 lg:pl-[150px] md:flex-row gap-4 md:gap-[30px] p-4">
        <div className="bg-transparent-cloud p-4 rounded-lg shadow-md w-full md:w-[200px] h-auto md:h-[360px]">
          <h2 className="text-base font-semibold mt-2">All Categories</h2>
          <ul className="mt-4">
            {Array.isArray(categories) && categories.map((category, index) => (
              <li
                key={category.id}
                className={`category flex items-center justify-between mb-2 ${category.id === selectedCategory ? 'selectedCategory' : ''
                  } ${index !== categories.length - 1 ? 'border-b pb-2' : ''}`}
              >
                <span className="text-sm">{category.name}</span>
                <ArrowRightIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => handleIconClick(category.id)}
                />
              </li>
            ))}
          </ul>
          <div className="flex mt-5">
            <div
              className="hover:text-green-700 flex items-center mt-1 rounded-md px-3 py-1 cursor-pointer"
              onClick={handleAddCategory}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              <p className="text-sm">Add Category</p>
            </div>
          </div>
        </div>
        {selectedCategory !== null && (
          <div className="bg-transparent-cloud p-4 rounded-lg shadow-md w-full md:w-[800px] min-h-[600px]">
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
              setShowNewProductModal={setShowNewProductModal} // Pasar setShowNewProductModal a ProductCards
            />
          </div>
        )}

        {selectedProduct && (
          <div className="w-full md:w-[300px] h-auto md:h-[350px] rounded overflow-hidden shadow-lg bg-white">
            <img
              src={`${API_URL_BASE}/${selectedProduct.img}`}
              alt={selectedProduct.name}
              className="w-full h-[200px] md:h-[100px] rounded-lg object-cover mb-2"
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{selectedProduct.name}</div>
              <hr className="my-2 border-gray-300" />
              <p className="text-gray-700 text-base mt-4 font-serif italic">
                {selectedProduct.description}
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <hr className="my-2 border-gray-300" />
              <p className="text-gray-700 text-base">Price: ${selectedProduct.price}</p>
              <hr className="my-2 border-gray-300" />
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center ml-auto md:ml-[150px]">
                  <span className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded-full cursor-pointer">
                    <PencilIcon onClick={openEditProduct} className="w-5 h-5" />
                  </span>
                  <span className="text-red-500 hover:text-red-700 font-bold py-2 px-4 rounded-full cursor-pointer">
                    <Trash onClick={DeleteProduct} className="w-5 h-5" />
                  </span>
                </div>
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
          productToEdit={productToUpdate}
          handleInputChange={(e) => {
            const { name, value } = e.target;
            setProductToUpdate({
              ...productToUpdate,
              [name]: value,
            });
          }}
          local_id={activeShop}
        />

        {/* Render NewProductModal here */}
        <ProductModal
          setNewCategory={setNewProduct}
          show={showNewProductModal}
          handleClose={() => setShowNewProductModal(false)}
          handleSubmit={handleCreateProduct}
          newProduct={newProduct}
          handleInputChange={(e) => {
            const { name, value } = e.target;
            setNewProduct({
              ...newProduct,
              [name]: value,
            });
          }}
          category_id={selectedCategory}
          setNewProduct={setNewProduct}
          selectedCategory={selectedCategory}
        />
      </div>
    </>
  );
}

export default Products;
