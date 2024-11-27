import { Routes, Route } from 'react-router-dom';
import { publicRoutes } from './Routes';
import { Fragment } from 'react';
import { DefaultLayout } from './components/Layout';

function App() {
    return (
        <div className="App">
           <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    const Layout =
                        route.layout === null
                            ? Fragment 
                            : route.layout || DefaultLayout; 

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
            </Routes>
        </div>
    );
}

export default App;
