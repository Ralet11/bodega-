import { 
  LOGIN_SUCCESS, CHANGE_SHOP, ADD_NEW_ORDER, SET_NEW_ORDER, ADD_PAY_METHODS, REMOVE_PAY_METHODS, 
  GET_CATEGORIES, SET_DISTPROD, ADD_TO_CART, REMOVE_FROM_CART, LOG_OUT, EMPTY_CART, 
  SET_DIST_ORDER, SET_CLIENT_LOCALS, 
  SET_CATEGORIES,
  RESET_CLIENT,
  SET_FINDED_PRODUCTS,
  SET_SUBCATEGORIES,
  SET_SELECTED_SUBCATEGORY,
  SET_ALL_DIST_PRODUCTS
} from "../actions/actions";

const initialState = {
  client: {},
  activeShop: null,
  orders: {
    "new order": [],
    accepted: [],
    sending: [],
    finished: [],
  },
  newOrder: false,
  categories: {},
  cart: [],
  subcategories: [],
  selectedSubcategory: null,
  allDistProducts: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, client: action.payload }
    case CHANGE_SHOP:
      return { ...state, activeShop: action.payload }
    case ADD_NEW_ORDER:
      return {
        ...state,
        orders: {
          ...state.orders,
          "new order": [...state.orders["new order"], action.payload],
        }
      }
    case SET_NEW_ORDER:
      return {
        ...state,
        newOrder: action.payload
      }
    case ADD_PAY_METHODS:
      return {
        ...state,
        client: {
          ...state.client,
          client: {
            ...state.client.client,
            payMethod: [...state.client.client.payMethod, action.payload[0]]
          }
        }
      };
    case REMOVE_PAY_METHODS:
      return {
        ...state,
        client: {
          ...state.client,
          client: {
            ...state.client.client,
            payMethod: action.payload
          }
        }
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
    case SET_DISTPROD:
      return {
        ...state,
        selectedDistProd: action.payload
      };
    case ADD_TO_CART:
      const existingItemIndex = state.cart.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex !== -1) {
        const updatedCart = state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          cart: updatedCart,
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: action.payload.quantity }],
        };
      }
    case REMOVE_FROM_CART:
      const itemIndex = state.cart.findIndex(item => item.id === action.payload.id);
      if (itemIndex !== -1) {
        const updatedCart = state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity - action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0);
        return {
          ...state,
          cart: updatedCart,
        };
      } else {
        return state;
      }
    case LOG_OUT:
      return initialState;
    case EMPTY_CART:
      return {
        ...state,
        cart: []
      }
    case SET_DIST_ORDER:
      return {
        ...state,
        order: action.payload
      }
    case SET_CLIENT_LOCALS:
      return {
        ...state,
        client: {
          ...state.client,
          locals: action.payload
        }
      }
    case SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      }
    case SET_FINDED_PRODUCTS:
      return {
        ...state,
        findedProducts: action.payload
      }
    case SET_SUBCATEGORIES: 
      return {
        ...state,
        subcategories: action.payload
      }
    case SET_SELECTED_SUBCATEGORY:
      return {
        ...state,
        selectedSubcategory: action.payload
      }
    case SET_ALL_DIST_PRODUCTS:
      return {
        ...state,
        allDistProducts: action.payload
      }
    default:
      return state;
  }
};

export default rootReducer;
