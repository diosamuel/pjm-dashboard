import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Login from './pages/Dashboard/Login';
import Logout from './pages/Dashboard/Logout';
import Katalog from './pages/Dashboard/Katalog';
import TambahKatalog from './pages/Dashboard/TambahKatalog';
import EditKatalog from './pages/Dashboard/EditKatalog';
import Home from './pages/Dashboard/Home';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <AuthProvider>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route
            index
            element={
              <ProtectedRoute
              element={()=>(
              <>
                <PageTitle title="Pardi Jaya Motor Dashboard" />
                <Home />
              </>
              )}/>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <PageTitle title="Pardi Jaya Motor Dashboard" />
                <Login />
              </>
            }
          />
          <Route
            path="/katalog"
            element={
              <ProtectedRoute
                element={() => (
                  <>
                    <PageTitle title="Pardi Jaya Motor Dashboard" />
                    <Katalog />
                  </>
                )}
              />
            }
          />
          <Route
            path="/tambah-katalog"
            element={
              <ProtectedRoute
                element={() => (
                  <>
                    <PageTitle title="Pardi Jaya Motor Dashboard" />
                    <TambahKatalog />
                  </>
                )}
              />
            }
          />

          <Route
            path="/edit-katalog/:id"
            element={
              <ProtectedRoute
                element={() => (
                  <>
                    <PageTitle title="Pardi Jaya Motor Dashboard" />
                    <EditKatalog />
                  </>
                )}
              />
            }
          />

          <Route path="/logout" element={
            <>
            <PageTitle title="Pardi Jaya Motor Dashboard" />
            <Logout />
            </>
          }/>

        </Routes>
      )}
    </AuthProvider>
  );
}

export default App;
