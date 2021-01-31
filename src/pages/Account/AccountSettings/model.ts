import type { Effect, Reducer } from 'umi';
import type { CurrentUser, GeographicItemType, ResponseType } from './data.d';
import { queryCity, queryCurrent, queryProvince, query as queryUsers, submitUpdate } from './service';

export interface ModalState {
  currentUser?: Partial<CurrentUser>;
  province?: GeographicItemType[];
  city?: GeographicItemType[];
  isLoading?: boolean;
  updateResponse?: ResponseType;
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetchCurrent: Effect;
    fetch: Effect;
    fetchProvince: Effect;
    fetchCity: Effect;
    submitUpdate: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<ModalState>;
    setUpdateResponse: Reducer<ModalState>;
    changeNotifyCount: Reducer<ModalState>;
    setProvince: Reducer<ModalState>;
    setCity: Reducer<ModalState>;
    changeLoading: Reducer<ModalState>;
    clearResponse: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'accountAndAccountSettings',

  state: {
    currentUser: {},
    province: [],
    city: [],
    isLoading: false,
    updateResponse: {},
  },

  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchProvince(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryProvince);
      yield put({
        type: 'setProvince',
        payload: response,
      });
    },
    * fetchCity({ payload }, { call, put }) {
      const response = yield call(queryCity, payload);
      yield put({
        type: 'setCity',
        payload: response,
      });
    },
    * submitUpdate({ payload }, { call, put }) {
      const response = yield call(submitUpdate, payload);
      yield put({
        type: 'setUpdateResponse',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    setUpdateResponse(state, action) {
      return {
        ...state,
        updateResponse: action.payload,
      };
    },
    changeNotifyCount(state = {}, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    setProvince(state, action) {
      return {
        ...state,
        province: action.payload,
      };
    },
    setCity(state, action) {
      return {
        ...state,
        city: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
    clearResponse(state){
      return{
        ...state,
        updateResponse: {},
      }
    },
  },
};

export default Model;
