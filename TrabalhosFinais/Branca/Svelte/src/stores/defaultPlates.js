import {writable} from 'svelte/store';
import localMenu from '../localMenu';
const store = writable ([...localMenu]);



// // featured store
// export const featuredStore = derived(store, $featured => {
//   return $featured.filter(item => item.featured === true);
// });

export default store;
