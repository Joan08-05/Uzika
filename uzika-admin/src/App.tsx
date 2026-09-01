import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Vendors from './pages/Vendors';
import Customers from './pages/Customers';
import Complaints from './pages/Complaints';
import Architecture from './pages/Architecture';

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/architecture" element={<Architecture />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}