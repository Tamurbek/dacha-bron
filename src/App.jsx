import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { ListingDetail } from './pages/ListingDetail';
import { Checkout } from './pages/Checkout';
import { Favorites } from './pages/Favorites';
import { ScrollToTop } from './components/ui/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
