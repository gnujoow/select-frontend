import { createReducer, createAction } from 'redux-act';

import { CategoryBooksResponse } from 'app/services/category/requests';
import { DefaultSelectionState } from 'app/services/selection';
import { FetchStatusFlag } from 'app/constants';

export const Actions = {
  loadCategoryListRequest: createAction(),

  loadCategoryListSuccess: createAction<{
    categoryList: Category[],
  }>(),

  loadCategoryListFailure: createAction(),

  initializeCategoryId: createAction(),

  initializeCategoriesWhole: createAction<{
    shouldFetchCategoryList: boolean,
    shouldInitializeCategoryId: boolean,
  }>(),

  cacheCategoryId: createAction<{
    categoryId: number,
  }>(),

  loadCategoryBooksRequest: createAction<{
    categoryId: number,
    page: number,
  }>(),

  loadCategoryBooksSuccess: createAction<{
    categoryId: number,
    page: number,
    response: CategoryBooksResponse,
  }>(),

  loadCategoryBooksFailure: createAction<{
    categoryId: number,
    page: number,
  }>(),
};

export interface Category {
  id: number;
  name: string;
}

export type CategoryListState = {
  lastSelectedCategoryId?: number;
  itemList: Category[];
  fetchStatus: FetchStatusFlag;
  isFetched: boolean;
};

export interface CategoryBooksState {
  [categoryId: number]: CategoryCollectionState;
}

export const categoryListInitialState: CategoryListState = {
  lastSelectedCategoryId: undefined,
  itemList: [],
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: false,
};

export interface CategoryCollectionState extends DefaultSelectionState {
  name: string;
}

export const INITIAL_STATE: CategoryBooksState = {

};

export const categoryListReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

categoryListReducer.on(Actions.loadCategoryListRequest, state => ({
	...state,
  fetchStatus: FetchStatusFlag.FETCHING,
}));

categoryListReducer.on(Actions.loadCategoryListSuccess, (state, { categoryList }) => ({
  ...state,
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: true,
  itemList: categoryList,
}));

categoryListReducer.on(Actions.loadCategoryListFailure, state => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

categoryListReducer.on(Actions.cacheCategoryId, (state, { categoryId }) => ({
  ...state,
  lastSelectedCategoryId: categoryId,
}));

export const categoryBooksReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

categoryBooksReducer.on(Actions.loadCategoryBooksRequest, (state = INITIAL_STATE, { page, categoryId }) => ({
  ...state,
  [categoryId]: {
    ...state[categoryId],
    id: categoryId,
    itemCount: 0,
    itemListByPage: {
      ...(state[categoryId] && state[categoryId].itemListByPage),
      [page]: {
        fetchStatus: FetchStatusFlag.FETCHING,
        itemList: [],
        isFetched: false,
      },
    },
  },
}));

categoryBooksReducer.on(Actions.loadCategoryBooksSuccess, (state = INITIAL_STATE, { categoryId, response, page }) => ({
  ...state,
  [categoryId]: {
    ...state[categoryId],
    itemListByPage: {
      ...state[categoryId].itemListByPage,
      [page]: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: response.books.map((book: any) => book.id),
        isFetched: true,
      },
    },
    name: response.category.name,
    itemCount: response.totalCount,
  },
}));

categoryBooksReducer.on(Actions.loadCategoryBooksFailure, (state = INITIAL_STATE, { categoryId, page }) => ({
  ...state,
  [categoryId]: {
    ...state[categoryId],
    itemListByPage: {
      ...state[categoryId].itemListByPage,
      [page]: {
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
        itemList: [],
        isFetched: false,
      },
    },
  },
}));
