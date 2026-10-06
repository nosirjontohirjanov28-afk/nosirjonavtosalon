import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Car as CarIcon,
  Percent,
  Check,
  Shield,
  Truck,
  PhoneCall,
  MapPin,
  Sparkles,
  Heart,
  ChevronDown
} from 'lucide-react';
import { Car, CartItem, Order, CarColor, CarOption, LicensePlate } from './types';
import { CARS_DATA, PRESET_LICENSE_PLATES } from './data/cars';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CarCard } from './components/CarCard';
import { CarDetailModal } from './components/CarDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { CreditCalculatorModal } from './components/CreditCalculatorModal';
import { OrdersListModal } from './components/OrdersListModal';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  // Persistence states
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('avtobozor_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('avtobozor_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('avtobozor_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrency] = useState<'USD' | 'UZS'>('USD');

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [onlyDiscounts, setOnlyDiscounts] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'year'>('popular');

  // Modals state
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [creditCar, setCreditCar] = useState<Car | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [checkoutPromoData, setCheckoutPromoData] = useState<{ promoCode?: string; discountUsd: number }>({
    discountUsd: 0
  });

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('avtobozor_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('avtobozor_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('avtobozor_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart Handlers
  const handleAddToCart = (
    car: Car,
    selectedColor?: CarColor,
    selectedOptions: CarOption[] = [],
    selectedPlate?: LicensePlate
  ) => {
    const color = selectedColor || car.colors[0];
    const plate = selectedPlate || PRESET_LICENSE_PLATES[0];
    const itemId = `${car.id}-${color.name}-${plate.id}-${selectedOptions.map((o) => o.id).sort().join('_')}`;

    setCartItems((prev) => {
      const existing = prev.find((it) => it.id === itemId);
      if (existing) {
        return prev.map((it) => (it.id === itemId ? { ...it, quantity: it.quantity + 1 } : it));
      }
      return [
        ...prev,
        {
          id: itemId,
          car,
          selectedColor: color,
          selectedOptions,
          selectedPlate: plate,
          quantity: 1
        }
      ];
    });

    showToast(`✓ "${car.name}" (${plate.fullPlate}) savatchaga qo'shildi!`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const newQ = it.quantity + delta;
            return newQ > 0 ? { ...it, quantity: newQ } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleProceedToCheckout = (promoCode?: string, discountUsd: number = 0) => {
    setCheckoutPromoData({ promoCode, discountUsd });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
    setActiveReceiptOrder(order);
    showToast(`🎉 Xarid muvaffaqiyatli amalga oshirildi! Shartnoma: ${order.orderNumber}`);
  };

  // Favorites
  const handleToggleFavorite = (car: Car) => {
    setFavorites((prev) => {
      const exists = prev.includes(car.id);
      if (exists) {
        showToast(`"${car.name}" sevimlilardan olib tashlandi`);
        return prev.filter((id) => id !== car.id);
      } else {
        showToast(`❤️ "${car.name}" sevimlilarga qo'shildi!`);
        return [...prev, car.id];
      }
    });
  };

  // Filtered & Sorted Cars
  const filteredCars = useMemo(() => {
    return CARS_DATA.filter((car) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = car.name.toLowerCase().includes(q);
        const matchesModel = car.shortModel.toLowerCase().includes(q);
        const matchesBrand = car.brand.toLowerCase().includes(q);
        const matchesCountry = car.country.toLowerCase().includes(q);
        const matchesYear = car.year.toString().includes(q);
        if (!matchesName && !matchesModel && !matchesBrand && !matchesCountry && !matchesYear) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'Uzbekistan') {
          if (car.country !== 'Uzbekistan') return false;
        } else if (selectedCategory === 'Xorijiy') {
          if (car.country === 'Uzbekistan') return false;
        } else if (selectedCategory === 'Damas') {
          if (car.shortModel !== 'Damas') return false;
        } else if (selectedCategory === 'Qora Gentra') {
          if (!car.name.includes('Gentra')) return false;
        } else if (car.brand !== selectedCategory && car.shortModel !== selectedCategory) {
          return false;
        }
      }

      // Body Type filter
      if (selectedBodyType !== 'all') {
        if (car.bodyType !== selectedBodyType) return false;
      }

      // Discount filter
      if (onlyDiscounts) {
        if (!car.discountPercent || car.discountPercent <= 0) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceUsd - b.priceUsd;
      if (sortBy === 'price_desc') return b.priceUsd - a.priceUsd;
      if (sortBy === 'year') return b.year - a.year;
      // 'popular'
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, selectedBodyType, onlyDiscounts, sortBy]);

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 pb-16 md:pb-0">
      {/* Top Banner Promotion */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 text-xs font-bold py-1.5 px-4 text-center">
        <span>🔥 Yangi mavsum: Lacetti, Cobalt, Tracker, BMW va Supra modellariga maxsus chegirmalar! Bepul yetkazib berish.</span>
      </div>

      {/* Top Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCreditModal={() => {
          setCreditCar(null);
          setIsCreditOpen(true);
        }}
        onOpenOrdersModal={() => setIsOrdersOpen(true)}
        currency={currency}
        onToggleCurrency={() => setCurrency((c) => (c === 'USD' ? 'UZS' : 'USD'))}
        activeFilter={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        favoritesCount={favorites.length}
        onOpenFavorites={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          // Filter to favorites
          showToast(`❤️ Sevimlilar ro'yxatida ${favorites.length} ta mashina bor`);
        }}
      />

      {/* Hero Showcase & Filter */}
      <HeroBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onlyDiscounts={onlyDiscounts}
        onToggleOnlyDiscounts={() => setOnlyDiscounts((v) => !v)}
        onOpenCreditModal={() => {
          setCreditCar(null);
          setIsCreditOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Filter & Sort Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
          {/* Segmented Controls for Body Type */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Barcha turlar' },
              { id: 'Sedan', label: 'Sedanlar' },
              { id: 'Krossover', label: 'Krossover / SUV' },
              { id: 'Sportkar', label: 'Sportkarlar' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedBodyType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedBodyType === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results count & Sort */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
            <span className="text-slate-400 tabular-nums">
              Topildi: <span className="font-bold text-white">{filteredCars.length}</span> ta avtomobil
            </span>

            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'price_asc' | 'price_desc' | 'year')}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="popular">Tavsiya etilganlar</option>
                <option value="price_asc">Narx: arzonroqdan</option>
                <option value="price_desc">Narx: qimmatroqdan</option>
                <option value="year">Yili: eng yangilar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/60 p-8">
            <div className="w-20 h-20 rounded-3xl bg-slate-800/80 flex items-center justify-center text-4xl mx-auto mb-4">
              🚗
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Qidiruv bo'yicha mashina topilmadi</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Boshqa so'z bilan qidirib ko'ring yoki filtrlarni tozalang (masalan: Gentra, Cobalt, BMW, Supra).
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedBodyType('all');
                setOnlyDiscounts(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Barcha filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                currency={currency}
                onSelect={(c) => setSelectedCar(c)}
                onAddToCart={(c) => handleAddToCart(c)}
                isFavorite={favorites.includes(car.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* Feature / Dealership Trust Section */}
        <section className="mt-16 sm:mt-24 pt-12 border-t border-slate-800/80">
          <div className="max-w-3xl mb-10">
            <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">
              Nega aynan AVTOBOZOR.UZ?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              O'zbekistondagi eng ishonchli va zamonaviy avtosalon
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Eshikkacha bepul yetkazish</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Toshkent shahri va O'zbekistonning barcha 12 ta viloyatiga maxsus yopiq evakuatorlar orqali xavfsiz yetkazib beramiz.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">To'liq rasmiy kafolat</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Har bir avtomobil to'liq bojxona va texnik ko'rikdan o'tgan. Zavod tomonidan 3 yildan 6 yilgacha rasmiy kafolat taqdim etiladi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Istalgan usulda to'lov</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Payme, Click, Uzum Pay, Uzcard/Humo va naqd to'lov. Shuningdek, 15 daqiqada rasmiylashtiriladigan 18% lik imtiyozli avtokredit!
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-slate-950 border-t border-slate-800/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-lg font-extrabold text-white">
              AVTOBOZOR<span className="text-amber-500">.UZ</span>
            </span>
            <p className="text-xs text-slate-400 mt-1">
              O'zbekiston va xorijiy avtomobillar onlayn rasmiy savdo markazi.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" /> Toshkent sh., Amir Temur shox ko'chasi 45
              </span>
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> +998 (71) 200-00-00
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">To'lov hamkorlari:</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">Payme</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-blue-400 font-bold">CLICK</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-violet-400 font-bold">Uzum</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-white font-medium">Uzcard / Humo</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-medium">Naqd to'lov</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={selectedCategory}
        cartCount={totalCartCount}
        onSelectTab={(tab) => {
          setSelectedCategory(tab);
          setOnlyDiscounts(false);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCredit={() => {
          setCreditCar(null);
          setIsCreditOpen(true);
        }}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onToggleDiscounts={() => setOnlyDiscounts((v) => !v)}
        onlyDiscounts={onlyDiscounts}
      />

      {/* Modals */}
      <CarDetailModal
        car={selectedCar}
        onClose={() => setSelectedCar(null)}
        currency={currency}
        onAddToCart={handleAddToCart}
        onOpenCreditModal={(c) => {
          setSelectedCar(null);
          setCreditCar(c);
          setIsCreditOpen(true);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        promoCode={checkoutPromoData.promoCode}
        discountUsd={checkoutPromoData.discountUsd}
        onOrderSuccess={handleOrderSuccess}
      />

      <CreditCalculatorModal
        isOpen={isCreditOpen}
        onClose={() => setIsCreditOpen(false)}
        initialCar={creditCar}
        onSelectCarForPurchase={(c) => {
          handleAddToCart(c);
          setIsCartOpen(true);
        }}
      />

      <OrdersListModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onSelectOrder={(ord) => setActiveReceiptOrder(ord)}
      />

      <OrderSuccessModal
        order={activeReceiptOrder}
        onClose={() => setActiveReceiptOrder(null)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 bg-slate-900 border border-amber-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
