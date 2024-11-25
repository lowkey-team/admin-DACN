// HeaderOnly Layout
import AddMoreProduct from '~/pages/AddMoreProduct';
import CustomerManagement from '~/pages/CustomerManagement';
import Product from '~/pages/Product';
import Profile from '~/pages/Product';
//Public Routes
const publicRoutes = [
    { path: '/', component: Product },
    { path: '/p', component: Profile },
    { path: '/addmoreproduct', component: AddMoreProduct },
    { path: '/customer', component: CustomerManagement },
];

//Private Routers
const privateRoutes = [];

export { publicRoutes, privateRoutes };
