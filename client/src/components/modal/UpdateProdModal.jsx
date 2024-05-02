import { useEffect, useState } from 'react'; 
import PropTypes from 'prop-types';
import { PhotoIcon } from '@heroicons/react/24/solid';
import axios from "axios"
import { getParamsEnv } from "../../functions/getParamsEnv";

const {API_URL_BASE} = getParamsEnv(); 

export default function UpDateProductModal({
  selectedProduct,
  show,
  handleClose,
  handleUpdate,
  handleInputChange,
  productToEdit,
}) {
  
  // Initialize a state to hold the edited product
  const [editedProduct, setEditedProduct] = useState(productToEdit);
  console.log

  // Whenever productToEdit changes, update the editedProduct state
  useEffect(() => {
    setEditedProduct(productToEdit);
  }, [productToEdit]);

  const onSubmit = (e) => {
    console.log(editedProduct)
    e.preventDefault();
    handleUpdate();
  };

  const onClose = () => {
    setEditedProduct(productToEdit)
    handleClose()
  }

  async function convertBlobUrlToImageFile(blobUrl) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const filename = 'image.png';
    const type = 'image/png'; // Especifica el tipo MIME de la imagen
    return new File([blob], filename, { type });
  }

  const handleImageUpload = async (productId, img) => {
    console.log(productId, img)

      const formData = new FormData();
      formData.append('id', productId);
      formData.append('action', 'product');
      formData.append('image', img);
      console.log(formData)
      try {
        const response = await axios.post(`${API_URL_BASE}/api/up-image/`, formData);
        if (response.status === 200) {
          console.log('Image uploaded successfully');
        } else {
          console.error('Error uploading image');
        }
        window.alert("image updated")
      } catch (error) {
        console.error('Error uploading image:', error);
      }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file)
      setEditedProduct({
        ...editedProduct,
        img: imageUrl
      });
      const imageFile = await convertBlobUrlToImageFile(imageUrl);
      handleImageUpload(selectedProduct.id, imageFile)
    }
}

  return (
    <div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition duration-300 ease-in-out">
          <div className="fixed inset-0 bg-black opacity-50"></div>

          <div className="bg-white w-[700px] h-[400px] rounded-lg shadow-lg relative">
            <div className="w-100%">
              <div className="w-100% bg-blue-400 min-h-[60px] pt-4">
                <h2 className="text-xl font-semibold mb-4 ml-2">Edit Product</h2>
              </div>
              <div className="m-3">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="min-w-[300px] min-h-[300px] bg-gray-100 p-4 rounded-lg shadow-md">
                    <form onSubmit={onSubmit}>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="name"
                          placeholder="Name"
                          value={editedProduct.name} // Use editedProduct instead of productToEdit
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="number"
                          name="price"
                          placeholder="Price"
                          value={editedProduct.price} // Use editedProduct instead of productToEdit
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="description"
                          placeholder="Description"
                          value={editedProduct.description} // Use editedProduct instead of productToEdit
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <PhotoIcon className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-500">Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            name="img"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <button className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-600" type="submit">
                        Save Changes
                      </button>
                    </form>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <div className="mt-[-10px] w-[300px] h-[300px] rounded overflow-hidden shadow-lg mt-5 bg-white">
                      <img
                        src={editedProduct.img || `${API_URL_BASE}${selectedProduct.img}`} // Use editedProduct.img
                        alt={selectedProduct.name || 'Product Preview'}
                        className="w-full h-[100px] rounded-lg object-cover mb-2"
                      />
                      <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{editedProduct.name || selectedProduct.name}</div>
                        <hr className="my-2 border-gray-300" />
                        <p className="text-gray-700 text-base mt-4 font-serif italic">
                          {editedProduct.description || selectedProduct.description}
                        </p>
                      </div>
                      <div className="px-6 pt-4 pb-2">
                        <hr className="my-2 border-gray-300" />
                        <p className="text-gray-700 text-base">Price: ${editedProduct.price || selectedProduct.price}</p>
                        <hr className="my-2 border-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 px-6 py-4 flex justify-end">
              <button onClick={onClose} className="text-blue-500 hover:underline cursor-pointer mr-4">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

UpDateProductModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  productToEdit: PropTypes.object.isRequired,
  selectedProduct: PropTypes.object,
};
