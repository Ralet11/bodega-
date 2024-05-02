export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const CHANGE_SHOP = 'CHANGE_SHOP'
export const ADD_NEW_ORDER = 'ADD_NEW_ORDER'
export const SET_NEW_ORDER = 'SET_NEW_ORDER'
export const ADD_PAY_METHODS = "UPDATE_PAY_METHODS"
export const REMOVE_PAY_METHODS = "REMOVE_PAY_METHODS"
export const GET_CATEGORIES = "GET_CATEGORIES"

import axios from "axios";

export const loginSuccess = (user) => {
  
  return {
    type: LOGIN_SUCCESS,
    payload: user
  };
};

export const changeShop = (shop) => {
  console.log("action")
  return {
    type: CHANGE_SHOP,
    payload: shop
  }
}

export const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('app_key'); // Reemplaza 'yourAppStateKey' con una clave única
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('app_key', serializedState); // Reemplaza 'yourAppStateKey' con una clave única
  } catch (err) {
    // Manejar errores de almacenamiento local aquí.
  }
};

export const addNewOrder = (order) => {
  return {
    type: ADD_NEW_ORDER,
    payload: order,
  };
};

export const setNewOrder = (status) => {
  return {
    type: SET_NEW_ORDER,
    payload: status
  }
}

export const addPayMethods = (methods) => {
  console.log("action")
  console.log(methods, "action metodos")
  return {
    type: ADD_PAY_METHODS,
    payload: methods
  }
}

export const removePayMethods = (methods) => {
  console.log("action")
  console.log(methods, "action metodos")
  return {
    type: REMOVE_PAY_METHODS,
    payload: methods
  }
}

export const getCategories = () => {
  return async (dispatch) => {
    try {
     
      const response = await axios.get(`${API_URL_BASE}/api/locals_categories/getAll`);
      console.log(response, "action categories")

    
      dispatch({
        type: GET_CATEGORIES,
        payload: response.data,
      });
    } catch (error) {
     
      console.error('Error al obtener categorías:', error);
    }
  };
};