import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './components/Layout/DefaultLayout';
import PrivateRoute from './components/PrivateRoute'; // Import đúng PrivateRoute
import { Fragment } from 'react';
import { privateRoutes, publicRoutes } from './Routes';

function App() {
    return (
        <div className="App">
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}

                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <Page />
                                    </Layout>
                                </PrivateRoute>
                            }
                        />
                    );
                })}
            </Routes>
        </div>
    );
}

export default App;
