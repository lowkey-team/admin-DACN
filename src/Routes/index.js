// // HeaderOnly Layout
// import { DefaultLayout } from '~/components/Layout';
// import AddMoreProduct from '~/pages/AddMoreProduct';
// import CategoryManager from '~/pages/CategoryManager';
// import CustomerManagement from '~/pages/CustomerManagement';
// import Invoice from '~/pages/Invoice';
// import Login from '~/pages/Login';
// import Product from '~/pages/Product';
// //Public Routes
// const publicRoutes = [
//     { path: '/addmoreproduct', component: AddMoreProduct },
//     { path: '/customer', component: CustomerManagement },
//     { path: '/invoice', component: Invoice },
//     { path: '/category', component: CategoryManager },
//     { path: '/login', component: Login, layout: null },
// ];

// const privateRoutes = [{ path: '/product', component: Product }];

// export { publicRoutes, privateRoutes };
// HeaderOnly Layout
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { DefaultLayout } from '~/components/Layout';
import AddMoreProduct from '~/pages/AddMoreProduct';
import CategoryManager from '~/pages/CategoryManager';
import CustomerManagement from '~/pages/CustomerManagement';
import Invoice from '~/pages/Invoice';
import Login from '~/pages/Login';
import Product from '~/pages/Product';

const publicRoutes = [{ path: '/', component: Login, layout: null }];

const privateRoutes = [
    { path: '/product', component: Product },
    { path: '/addmoreproduct', component: AddMoreProduct },
    { path: '/customer', component: CustomerManagement },
    { path: '/invoice', component: Invoice },
    { path: '/category', component: CategoryManager },
];

export { publicRoutes, privateRoutes };
