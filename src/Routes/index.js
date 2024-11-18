// HeaderOnly Layout
import AddMoreProduct from '~/pages/AddMoreProduct';
import Product from '~/pages/Product';
import Profile from '~/pages/Product';
//Public Routes
const publicRoutes = [
    { path: '/', component: Product },
    { path: '/p', component: Profile },
    { path: '/addmoreproduct', component: AddMoreProduct },
];

//Private Routers
const privateRoutes = [];

export { publicRoutes, privateRoutes };
