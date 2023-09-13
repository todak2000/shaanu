/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { dateFormaterString } from '../../utils'
import { ITEM_DELIVERY_SUCCESS, CLEAR_SINGLE_ITEM, GET_SINGLE_ITEM_SUCCESS, GET_SINGLE_ITEM_FAILURE, CATALOG_SUCCESS, INVENTORY_RECIVER_ADD, INVENTORY_RECIVER_REMOVE,INVENTORY_UPDATE_ADD, INVENTORY_UPDATE_REMOVE, INVENTORY_LOADING, INVENTORY_SUCCESS, INVENTORY_FAILURE, CATALOG_FAILURE } from '../constants'

const InventoryReducer = (state: any, action: any) => {
  switch (action.type) {
    case INVENTORY_LOADING:
      return {
        ...state,
        loading: action.loading
      }
    case CLEAR_SINGLE_ITEM:
      return {
        ...state,
        loading: action.loading,
        singleItem: {}
      }
    case INVENTORY_SUCCESS:
      return {
        ...state,
        inventory: action.payload.inventory,
        oldInventory: action.payload.oldInventory,
      }
    case CATALOG_SUCCESS:
      return {
        ...state,
        catalog: action.payload
      }
    case INVENTORY_FAILURE:
    case CATALOG_FAILURE:
    case GET_SINGLE_ITEM_FAILURE:
      return {
        ...state,
        loading: false
      }
    case INVENTORY_UPDATE_ADD:
      return {
        ...state,
        inventory: state.inventory.map((item: any) =>
          item.id === action.payload.id
            ? { ...item, interestedParties: [...item.interestedParties, action.payload.newParty] }
            : item
        ),
      };
    case INVENTORY_RECIVER_ADD:
      return {
        ...state,
        inventory: state.inventory.map((item: any) =>
          item.id === action.payload.id
            ? { ...item, receiver: action.payload.receiver }
            : item
        ),
      }
    case GET_SINGLE_ITEM_SUCCESS:
      return {
        ...state,
        singleItem:action.payload
      }
    case ITEM_DELIVERY_SUCCESS:
      return {
        ...state,
        inventory: state.inventory.map((item: any) =>
          item.id === action.payload.id
            ? { ...item, status: action.payload.status}
            : item
        ),
      }
    case INVENTORY_RECIVER_REMOVE:
      return {
        ...state,
        inventory: state.inventory.map((item: any) =>
          item.id === action.payload
            ? { ...item, receiver: "" }
            : item
        ),
      }
    case INVENTORY_UPDATE_REMOVE:
      return {
        ...state,
        inventory: state.inventory.map((item: any) =>
          item.id === action.payload.id
            ? { ...item, interestedParties: item.interestedParties.filter((party: any) => party !== action.payload.removeParty) }
            : item
        ),
      };
      // return {
      //   ...state,
      //   inventory: [...state.inventory, state.inventory.map(
      //     (item: any) =>
      // item.id === action.payload.id
      //   ? { ...item, interestedParties: item.interestedParties.filter((party:any)=> party !== action.payload.removeParty) }
      //   : item
      //   ) ]
      // }
    default:
      return state
  }
}

export default InventoryReducer
