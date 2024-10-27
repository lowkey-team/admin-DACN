import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./Routes";
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {
            publicRoutes.map((route, index) => {
              
              let CustomLayout = Layout;
              if (route.layout) {
                CustomLayout = route.layout;
              } else if (route.layout === null) {
                CustomLayout = Fragment;
              }

              const Page = route.component;
              return <Route key={index} path={route.path} element={<CustomLayout><Page /></CustomLayout>} />
            })
          }
        </Routes>
      </div>
    </Router>
  );
}

export default App;
