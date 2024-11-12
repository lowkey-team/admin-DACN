// HeaderOnly Layout
import Product from '~/pages/Product';
import Profile from '~/pages/Product';
//Public Routes
const publicRoutes = [
    { path: '/', component: Product },
    { path: '/p', component: Profile },
];

//Private Routers
const privateRoutes = [];

export { publicRoutes, privateRoutes };
