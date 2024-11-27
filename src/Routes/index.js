// HeaderOnly Layout
import AddMoreProduct from '~/pages/AddMoreProduct';
import CategoryManager from '~/pages/CategoryManager';
import CustomerManagement from '~/pages/CustomerManagement';
import Invoice from '~/pages/Invoice';
import Product from '~/pages/Product';
//Public Routes
const publicRoutes = [
    { path: '/product', component: Product },
    { path: '/addmoreproduct', component: AddMoreProduct },
    { path: '/customer', component: CustomerManagement },
    { path: '/invoice', component: Invoice },
    { path: '/category', component: CategoryManager },
];

//Private Routers
const privateRoutes = [];

export { publicRoutes, privateRoutes };
