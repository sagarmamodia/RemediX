import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
           <Route path="/login" element={<Login />} />

          {/* Will Add other routes here as we implement them */}

            <Route path="*" element={<div className="p-8 text-center">404 - Not Found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
