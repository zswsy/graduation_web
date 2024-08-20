import type { App } from 'vue';
import { createPinia } from "pinia";
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia();

export function setupStore(app : App) {

    app.use(store);
    store.use(createPersistedState({
        auto:true,
        storage: window.localStorage, // 或者 window.sessionStorage
    }));
}




export { store };