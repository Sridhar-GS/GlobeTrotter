import React from 'react';

import Navbar from './components/layout/Navbar';
import PageContainer from './components/layout/PageContainer';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <div>
      <Navbar />
      <PageContainer>
        <AppRoutes />
      </PageContainer>
    </div>
  );
}
