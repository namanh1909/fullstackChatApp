import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage' // defaults to localStorage for web
import 'react-native-gesture-handler';
import rootReducer from '../reducer';
import { rootSaga } from '../saga';

const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['auth'],
};



const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);


export const persistor = persistStore(store);