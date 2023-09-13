import { UPDATE_NOTIFICATION_LOADING, UPDATE_NOTIFICATION_SUCCESS, UPDATE_NOTIFICATION_FAILURE, USERDATA_FAILURE, USERDATA_LOADING, USERDATA_SUCCESS, LOGIN_LOADING, LOGIN_SUCCESS, LOGOUT_SUCCESS, CHANGE_PASSWORD_LOADING, CHANGE_PASSWORD_SUCCESS } from '../constants'

interface AuthAction {
  type: typeof UPDATE_NOTIFICATION_LOADING | typeof UPDATE_NOTIFICATION_FAILURE | typeof UPDATE_NOTIFICATION_SUCCESS | typeof USERDATA_LOADING | typeof USERDATA_SUCCESS | typeof USERDATA_FAILURE | typeof LOGIN_LOADING | typeof LOGIN_SUCCESS | typeof LOGOUT_SUCCESS | typeof CHANGE_PASSWORD_LOADING | typeof CHANGE_PASSWORD_SUCCESS
  loading?: boolean
  payload?: Partial<any>
}

const AuthReducer = (state: any, action: AuthAction): any => {
  switch (action.type) {
    case LOGIN_LOADING:
    case USERDATA_LOADING:
    case CHANGE_PASSWORD_LOADING:
    case UPDATE_NOTIFICATION_LOADING:
      return {
        ...state,
        loading: action.loading
      }
    case LOGIN_SUCCESS:
    case USERDATA_SUCCESS:
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    case LOGOUT_SUCCESS:
    case USERDATA_FAILURE:
    case UPDATE_NOTIFICATION_FAILURE:
      return {
        ...state,
        loading: action.loading,
        isRegistered: false
      }
    case UPDATE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        userData: {
          ...state.userData,
          expoPushToken: action.payload
        }
      }
    default:
      return state
  }
}

export default AuthReducer
