import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import { HomePage } from './pages/HomePage/HomePage';
import { Reports } from './pages/Reports/Reports';


function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout />
          }
        >
          <Route index element={<HomePage />} /> {/* Muestra en "/" */}
          {
            /*
            <Route path="venues" element={<VenuesList />} />
            <Route path="venues/create" element={<CreateVenue />} />
            <Route path="venues/:id" element={<DetailVenue />} />
            <Route path="venues/:id/edit" element={<EditVenue />} />
            <Route path="dashboard" element={<Dashboard />} />
            */
          }
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
