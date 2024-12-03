import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from '../reducer/reducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Usa el almacenamiento web predeterminado
import { createMigrate } from 'redux-persist';

// Definir migraciones para versiones anteriores del estado
const migrations = {
    1: (state) => ({
        ...state,
        tutorial: state.tutorial || { seen: false, step: 0 },
    }),
};

// Configuración de persistencia
const persistConfig = {
    key: 'root',
    version: 1, // Cambia la versión al hacer modificaciones estructurales en el estado
    storage, // Cambia AsyncStorage por storage de redux-persist para el entorno web
    migrate: createMigrate(migrations, { debug: false }),
};

// Crear el reducer persistente
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Crear el store con el reducer persistente y aplicar middleware
const store = createStore(
    persistedReducer,
    applyMiddleware(thunk) // Usa thunk como middleware
);

// Crear el persistor
export const persistor = persistStore(store);

export default store;
