import { LOGIN_SUCCESS, CHANGE_SHOP, ADD_NEW_ORDER, SET_NEW_ORDER, ADD_PAY_METHODS, REMOVE_PAY_METHODS, GET_CATEGORIES } from "../actions/actions";


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
  categories: {}
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
        console.log(state.client.client.payMethod,"reducer")
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
        console.log(state.categories,"reducer")
        return {
          ...state,
          categories: action.payload
        };
    default:
      return state;
  }
};

export default rootReducer;