import { LOGIN_SUCCESS, CHANGE_SHOP, ADD_NEW_ORDER, SET_NEW_ORDER, ADD_PAY_METHODS, REMOVE_PAY_METHODS, GET_CATEGORIES, SET_DISTPROD, ADD_TO_CART, REMOVE_FROM_CART } from "../actions/actions";

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
  cart: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, client: action.payload }
    case CHANGE_SHOP:
      console.log(action.payload)
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
      console.log(action.payload)

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
      console.log(state.client.client.payMethod, "reducer")
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
      console.log(action.payload, "en reducer")
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
      case REMOVE_FROM_CART:
        console.log("remove3")
        const newCart = [...state.cart];
        const itemIndex = newCart.findIndex(item => item.id === action.payload);
        if (itemIndex !== -1) {
          newCart.splice(itemIndex, 1);
        }
        return {
          ...state,
          cart: newCart
        };
    default:
      return state;
  }
};

export default rootReducer;
