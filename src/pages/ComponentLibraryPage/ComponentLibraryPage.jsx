import { useState } from 'react';

import Button from '../../components/primitives/Button/Button';
import Badge from '../../components/primitives/Badge/Badge';
import OrderStatusBadge from '../../components/primitives/Badge/OrderStatusBadge';
import StockBadge from '../../components/primitives/Badge/StockBadge';
import Input from '../../components/primitives/Input/Input';
import Textarea from '../../components/primitives/Textarea/Textarea';
import Select from '../../components/primitives/Select/Select';
import Checkbox from '../../components/primitives/Checkbox/Checkbox';
import RadioGroup from '../../components/primitives/RadioGroup/RadioGroup';
import QuantityStepper from '../../components/primitives/QuantityStepper/QuantityStepper';
import StarSelector from '../../components/primitives/StarSelector/StarSelector';
import SearchInput from '../../components/primitives/SearchInput/SearchInput';
import ProductTypeToggle from '../../components/primitives/ProductTypeToggle/ProductTypeToggle';
import Pagination from '../../components/primitives/Pagination/Pagination';

import Navbar from '../../components/navigation/Navbar/Navbar';
import Breadcrumb from '../../components/navigation/Breadcrumb/Breadcrumb';
import CategoryStrip from '../../components/navigation/CategoryStrip/CategoryStrip';
import StatusTabBar from '../../components/navigation/StatusTabBar/StatusTabBar';
import FilterSidebar from '../../components/navigation/FilterSidebar/FilterSidebar';

import ProductCard from '../../components/products/ProductCard/ProductCard';
import ProductImageGallery from '../../components/products/ProductImageGallery/ProductImageGallery';
import BuyPanel from '../../components/products/BuyPanel/BuyPanel';

import CartItem from '../../components/cart/CartItem/CartItem';
import OrderSummary from '../../components/cart/OrderSummary/OrderSummary';
import EmptyState from '../../components/cart/EmptyState/EmptyState';

import OrderCard from '../../components/orders/OrderCard/OrderCard';
import OrderTimeline from '../../components/orders/OrderTimeline/OrderTimeline';
import OrderStatusAction from '../../components/orders/OrderStatusAction/OrderStatusAction';

import ReviewSummary from '../../components/reviews/ReviewSummary/ReviewSummary';
import ReviewCard from '../../components/reviews/ReviewCard/ReviewCard';

import ProfileHeader from '../../components/user/ProfileHeader/ProfileHeader';
import ProfileNav from '../../components/user/ProfileNav/ProfileNav';
import UserAvatar from '../../components/user/UserAvatar/UserAvatar';
import StatCard from '../../components/user/StatCard/StatCard';

import Modal from '../../components/overlays/Modal/Modal';
import ConfirmDeleteModal from '../../components/overlays/Modal/ConfirmDeleteModal';
import CheckoutModal from '../../components/overlays/Modal/CheckoutModal';
import Toast from '../../components/overlays/Toast/Toast';
import ToastContainer, { useToast } from '../../components/overlays/Toast/ToastContainer';
import SuccessCircle from '../../components/overlays/SuccessCircle/SuccessCircle';

/* ─── Sample data ──────────────────────────────────────────────── */
const SAMPLE_PRODUCT = {
  id: 1,
  name: 'Lenovo IdeaPad 15" 16GB Laptop',
  price: 950000,
  type: 'PHYSICAL',
  stock: 10,
  category: { name: 'Technology' },
  averageRating: 4.8,
  reviewCount: 24,
  seller: { firstName: 'Ada', lastName: 'Lovelace' },
  images: [],
};

const SAMPLE_REVIEWS = [
  { id: 1, rating: 5, comment: 'Excellent product, arrived in perfect condition.', reviewDate: '2026-10-12', firstName: 'Grace', lastName: 'Tanner',   userId: 2 },
  { id: 2, rating: 4, comment: 'Great value for money.', reviewDate: '2026-10-10', firstName: 'Ada',   lastName: 'Lovelace', userId: 1 },
  { id: 3, rating: 5, comment: 'Fast delivery, very happy.', reviewDate: '2026-10-08', firstName: 'Alan',  lastName: 'Turing',   userId: 3 },
];

const SAMPLE_CART = [
  { productId: 1, productName: 'Lenovo IdeaPad 15" Laptop', productCategory: 'Technology', quantity: 1, unitPrice: 950000, subtotal: 950000 },
  { productId: 2, productName: 'Notebook A4 Lined',         productCategory: 'Stationery', quantity: 3, unitPrice: 1200,   subtotal: 3600 },
];

const SAMPLE_ORDER = {
  id: 1042,
  status: 'PAID',
  orderDate: '2026-10-14T10:32:00',
  items: [{}, {}, {}],
  total: 998600,
};

const CATEGORIES = [
  { id: 1, name: '💻 Technology' },
  { id: 2, name: '📚 Stationery' },
  { id: 3, name: '🏃 Sports' },
  { id: 4, name: '🎓 Services' },
];

const ORDER_STATUS_TABS = [
  { label: 'All',       value: 'ALL',       count: 42 },
  { label: '⏳ Pending',  value: 'PENDING',   count: 8  },
  { label: '💳 Paid',     value: 'PAID',      count: 5  },
  { label: '📦 Shipped',  value: 'SHIPPED',   count: 3  },
  { label: '✅ Delivered',value: 'DELIVERED', count: 22 },
  { label: '❌ Cancelled',value: 'CANCELLED', count: 4  },
];

const CATEGORY_OPTIONS = [
  { value: '1', label: 'Technology' },
  { value: '2', label: 'Stationery' },
  { value: '3', label: 'Services' },
];

/* ─── Layout helpers ───────────────────────────────────────────── */
const Section = ({ id, title, count, children }) => (
  <section
    id={id}
    style={{ padding: '40px 48px', borderBottom: '2px solid var(--color-neutral-200)' }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28 }}>
      <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-brand-primary)', margin: 0 }}>
        {title}
      </h2>
      {count && (
        <span style={{ background: 'var(--color-neutral-100)', color: 'var(--color-neutral-600)', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
          {count}
        </span>
      )}
    </div>
    {children}
  </section>
);

const DemoRow = ({ children }) => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 16 }}>
    {children}
  </div>
);

const DemoGroup = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {label && (
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-500)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>
        {label}
      </div>
    )}
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      {children}
    </div>
  </div>
);

/* ─── Page ─────────────────────────────────────────────────────── */
const ComponentLibraryPage = () => {
  const [productType, setProductType] = useState('PHYSICAL');
  const [page, setPage]               = useState(2);
  const [activeCat, setActiveCat]     = useState(null);
  const [activeTab, setActiveTab]     = useState('ALL');
  const [profileSection, setProfileSection] = useState('edit');
  const [rating, setRating]           = useState(4);
  const [showModal, setShowModal]           = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCheckout, setShowCheckout]     = useState(false);
  const [showSuccess, setShowSuccess]       = useState(false);
  const { toasts, show: showToast, dismiss } = useToast();

  return (
    <div style={{ fontFamily: 'var(--font-family-base)', background: 'var(--color-neutral-50)', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-primary-light) 100%)', padding: '40px 48px', color: '#fff' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 8 }}>
          Component Library
        </h1>
        <p style={{ opacity: .8, maxWidth: 600, lineHeight: 1.6, margin: '0 0 20px' }}>
          All components of the UADE E-Commerce project. Every component uses only CSS tokens — no hardcoded colours or sizes.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['React 19 + JSX', 'CSS Custom Properties', '18 mockups', '33 components', 'WCAG AA ✓'].map((tag) => (
            <span key={tag} style={{ background: 'rgba(255,255,255,.15)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 1. Button */}
      <Section id="button" title="Button" count="7 variants · 3 sizes">
        <DemoRow>
          <DemoGroup label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </DemoGroup>
          <DemoGroup label="Variants">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="danger-outline">Danger outline</Button>
          </DemoGroup>
          <DemoGroup label="States">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </DemoGroup>
          <DemoGroup label="Icon button">
            <Button variant="primary" iconOnly icon="✏️" />
            <Button variant="ghost" iconOnly icon="🗑️" />
            <Button variant="secondary" iconOnly round icon="+" />
          </DemoGroup>
        </DemoRow>
      </Section>

      {/* 2. Badge */}
      <Section id="badge" title="Badge" count="12 variants">
        <DemoRow>
          <DemoGroup label="Product type">
            <Badge variant="physical">PHYSICAL</Badge>
            <Badge variant="service">SERVICE</Badge>
            <Badge variant="admin">ADMIN</Badge>
            <Badge variant="mine">My review</Badge>
            <Badge variant="cat">Technology</Badge>
          </DemoGroup>
          <DemoGroup label="Order status">
            {['PENDING','PAID','SHIPPED','DELIVERED','CANCELLED'].map((s) => (
              <OrderStatusBadge key={s} status={s} />
            ))}
          </DemoGroup>
          <DemoGroup label="Stock">
            <StockBadge status="ok"  count={10} />
            <StockBadge status="low" count={2} />
            <StockBadge status="out" />
          </DemoGroup>
        </DemoRow>
      </Section>

      {/* 3. Form Elements */}
      <Section id="form" title="Form Elements" count="9 components">
        <DemoRow>
          <Input label="Email" type="email" placeholder="ada@mail.com" required />
          <Input label="Student ID" value="L1234" hint="Your UADE student ID" onChange={() => {}} />
          <Input label="Password" type="password" value="123" error="Minimum 8 characters" onChange={() => {}} required />
          <Input label="Email" type="email" value="ada@mail.com" disabled hint="Read only" onChange={() => {}} />
        </DemoRow>
        <DemoRow>
          <div style={{ width: 260 }}>
            <Textarea label="Description" placeholder="Describe the product..." />
          </div>
          <div style={{ width: 260 }}>
            <Select label="Category" placeholder="Select a category" options={CATEGORY_OPTIONS} required />
          </div>
        </DemoRow>
        <DemoRow>
          <DemoGroup label="Checkboxes">
            <Checkbox label="Physical" checked onChange={() => {}} />
            <Checkbox label="Service" checked={false} onChange={() => {}} />
            <Checkbox label="(disabled)" disabled onChange={() => {}} />
          </DemoGroup>
          <DemoGroup label="RadioGroup">
            <RadioGroup
              name="demo-radio"
              value="all"
              onChange={() => {}}
              options={[
                { value: 'all',     label: 'All' },
                { value: 'in',      label: 'In stock' },
                { value: 'out',     label: 'Out of stock' },
              ]}
            />
          </DemoGroup>
          <DemoGroup label="QuantityStepper">
            <QuantityStepper defaultValue={2} />
          </DemoGroup>
          <DemoGroup label="StarSelector">
            <StarSelector value={rating} onChange={setRating} />
          </DemoGroup>
          <DemoGroup label="SearchInput">
            <SearchInput />
          </DemoGroup>
        </DemoRow>
      </Section>

      {/* 4. ProductTypeToggle */}
      <Section id="type-toggle" title="ProductTypeToggle">
        <ProductTypeToggle value={productType} onChange={setProductType} />
      </Section>

      {/* 5. Pagination */}
      <Section id="pagination" title="Pagination">
        <Pagination currentPage={page} totalPages={8} onPageChange={setPage} />
      </Section>

      {/* 6. Navbar */}
      <Section id="navbar" title="Navbar" count="3 variants">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Logged-in user', props: { user: { firstName: 'Ada' }, cartCount: 3 } },
            { label: 'Admin',          props: { user: { firstName: 'Ada' }, isAdmin: true } },
            { label: 'Guest',          props: { cartCount: 0 } },
          ].map(({ label, props }) => (
            <div key={label}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-500)', marginBottom: 8 }}>{label}</div>
              <Navbar {...props} />
            </div>
          ))}
        </div>
      </Section>

      {/* 7. Breadcrumb */}
      <Section id="breadcrumb" title="Breadcrumb">
        <Breadcrumb items={[
          { label: 'Home',       href: '#' },
          { label: 'Technology', href: '#' },
          { label: 'Lenovo IdeaPad 15"' },
        ]} />
      </Section>

      {/* 8. CategoryStrip */}
      <Section id="category-strip" title="CategoryStrip">
        <CategoryStrip categories={CATEGORIES} activeId={activeCat} onSelect={setActiveCat} />
      </Section>

      {/* 9. StatusTabBar */}
      <Section id="status-tabs" title="StatusTabBar">
        <StatusTabBar statuses={ORDER_STATUS_TABS} active={activeTab} onChange={setActiveTab} />
      </Section>

      {/* 10. FilterSidebar */}
      <Section id="filter-sidebar" title="FilterSidebar">
        <FilterSidebar />
      </Section>

      {/* 11. ProductCard */}
      <Section id="product-card" title="ProductCard" count="3 states">
        <DemoRow>
          {[
            { label: 'Physical · in stock', product: SAMPLE_PRODUCT },
            { label: 'Service', product: { ...SAMPLE_PRODUCT, id: 2, type: 'SERVICE', name: 'Python · Data Science Class', price: 12000, stock: undefined, minutesDuration: 60, category: { name: 'Services' } } },
            { label: 'Out of stock', product: { ...SAMPLE_PRODUCT, id: 3, name: 'A4 Lined Notebook', price: 1200, stock: 0, averageRating: 3.2, reviewCount: 5, category: { name: 'Stationery' } } },
          ].map(({ label, product }) => (
            <div key={label}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-500)', marginBottom: 8 }}>{label}</div>
              <ProductCard product={product} />
            </div>
          ))}
        </DemoRow>
      </Section>

      {/* 12. ProductImageGallery */}
      <Section id="gallery" title="ProductImageGallery">
        <div style={{ width: 280 }}>
          <ProductImageGallery images={[{}, {}, {}, {}]} />
        </div>
      </Section>

      {/* 13. BuyPanel */}
      <Section id="buy-panel" title="BuyPanel">
        <div style={{ width: 260 }}>
          <BuyPanel product={SAMPLE_PRODUCT} />
        </div>
      </Section>

      {/* 14. CartItem */}
      <Section id="cart-item" title="CartItem">
        <div style={{ maxWidth: 580 }}>
          {SAMPLE_CART.map((item) => (
            <div key={item.productId} style={{ marginBottom: 12 }}>
              <CartItem item={item} />
            </div>
          ))}
        </div>
      </Section>

      {/* 15. OrderSummary */}
      <Section id="order-summary" title="OrderSummary">
        <div style={{ width: 260 }}>
          <OrderSummary items={SAMPLE_CART} />
        </div>
      </Section>

      {/* 16. EmptyState */}
      <Section id="empty-state" title="EmptyState">
        <DemoRow>
          <EmptyState icon="🛒" title="Your cart is empty" description="Browse categories and find what you need." action={{ label: 'Go to home', onClick: () => {} }} />
          <EmptyState icon="📦" title="No orders yet" description="When you make a purchase, it will appear here." action={{ label: 'Browse products', onClick: () => {} }} />
        </DemoRow>
      </Section>

      {/* 17. OrderCard */}
      <Section id="order-card" title="OrderCard">
        <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <OrderCard order={SAMPLE_ORDER} />
          <OrderCard order={{ ...SAMPLE_ORDER, id: 1041, status: 'DELIVERED', orderDate: '2026-10-10T14:20:00', items: [{}], total: 45000 }} />
        </div>
      </Section>

      {/* 18. OrderTimeline */}
      <Section id="order-timeline" title="OrderTimeline">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
          {['PENDING','PAID','SHIPPED','DELIVERED','CANCELLED'].map((s) => (
            <div key={s}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-500)', marginBottom: 6 }}>Status: {s}</div>
              <OrderTimeline status={s} />
            </div>
          ))}
        </div>
      </Section>

      {/* 19. OrderStatusAction */}
      <Section id="order-action" title="OrderStatusAction" count="Admin">
        <DemoRow>
          {['PENDING','PAID','SHIPPED','DELIVERED'].map((s) => (
            <div key={s}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-500)', marginBottom: 6 }}>{s}</div>
              <OrderStatusAction orderId={1} currentStatus={s} />
            </div>
          ))}
        </DemoRow>
      </Section>

      {/* 20. ReviewSummary */}
      <Section id="review-summary" title="ReviewSummary">
        <ReviewSummary reviews={SAMPLE_REVIEWS} />
      </Section>

      {/* 21. ReviewCard */}
      <Section id="review-card" title="ReviewCard" count="2 variants">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
          <ReviewCard review={SAMPLE_REVIEWS[0]} />
          <ReviewCard review={SAMPLE_REVIEWS[1]} isOwner onEdit={() => {}} onDelete={() => {}} />
        </div>
      </Section>

      {/* 22. ProfileHeader */}
      <Section id="profile-header" title="ProfileHeader">
        <div style={{ maxWidth: 520 }}>
          <ProfileHeader user={{ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@mail.com', regNumber: 'L1', isEnabled: true }} />
        </div>
      </Section>

      {/* 23. ProfileNav */}
      <Section id="profile-nav" title="ProfileNav">
        <div style={{ width: 200 }}>
          <ProfileNav activeId={profileSection} onChange={setProfileSection} />
        </div>
      </Section>

      {/* 24. UserAvatar */}
      <Section id="user-avatar" title="UserAvatar">
        <DemoRow>
          <UserAvatar user={{ firstName: 'Ada',   lastName: 'Lovelace' }} size="sm" />
          <UserAvatar user={{ firstName: 'Grace', lastName: 'Tanner'   }} size="md" />
          <UserAvatar user={{ firstName: 'Alan',  lastName: 'Turing'   }} size="md" />
          <UserAvatar user={{ firstName: 'Ada',   lastName: 'Lovelace' }} size="lg" />
        </DemoRow>
      </Section>

      {/* 25. StatCard */}
      <Section id="stat-card" title="StatCard">
        <DemoRow>
          <StatCard value={18} label="Listings"   />
          <StatCard value={14} label="In stock"   color="success" />
          <StatCard value={2}  label="Low stock"  color="warning" />
          <StatCard value={2}  label="Out of stock" color="error" />
        </DemoRow>
      </Section>

      {/* 26. Modal */}
      <Section id="modal" title="Modal" count="3 variants">
        <DemoRow>
          <Button onClick={() => setShowModal(true)}>Open generic modal</Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete modal</Button>
          <Button variant="secondary" onClick={() => setShowCheckout(true)}>Checkout modal</Button>
          <Button variant="accent" onClick={() => setShowSuccess(true)}>Success screen</Button>
        </DemoRow>

        {showModal && (
          <Modal title="Confirm action" onConfirm={() => setShowModal(false)} onCancel={() => setShowModal(false)}>
            <p>Are you sure you want to proceed with this action?</p>
          </Modal>
        )}
        {showDeleteModal && (
          <ConfirmDeleteModal productName="A4 Lined Notebook" onConfirm={() => setShowDeleteModal(false)} onCancel={() => setShowDeleteModal(false)} />
        )}
        {showCheckout && (
          <CheckoutModal items={SAMPLE_CART} onConfirm={() => setShowCheckout(false)} onCancel={() => setShowCheckout(false)} />
        )}
        {showSuccess && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}
            onClick={() => setShowSuccess(false)}
          >
            <div
              style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SuccessCircle orderId={1043} />
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button onClick={() => setShowSuccess(false)}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* 27. Toast */}
      <Section id="toast" title="Toast" count="4 variants">
        <DemoRow>
          <Button variant="primary"   onClick={() => showToast({ variant: 'success', title: 'Added to cart!', description: 'LG 24" Full HD Monitor · ×1', actions: [{ label: 'View cart', onClick: () => {} }] })}>Toast success</Button>
          <Button variant="danger"    onClick={() => showToast({ variant: 'error',   title: 'Processing error', description: 'Not enough stock available' })}>Toast error</Button>
          <Button variant="accent"    onClick={() => showToast({ variant: 'warning', title: 'Low stock', description: 'Only 2 units remaining' })}>Toast warning</Button>
          <Button variant="secondary" onClick={() => showToast({ variant: 'info',    title: 'Profile updated', description: 'Changes saved successfully' })}>Toast info</Button>
        </DemoRow>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Toast variant="success" title="Added to cart!"    description="LG 24 Full HD Monitor · ×1" />
          <Toast variant="error"   title="Processing error"  description="Not enough stock available" />
          <Toast variant="warning" title="Low stock"          description="Only 2 units remaining" />
          <Toast variant="info"    title="Profile updated"   description="Changes saved successfully" />
        </div>
      </Section>

      {/* 28. SuccessCircle */}
      <Section id="success-circle" title="SuccessCircle">
        <SuccessCircle orderId={1043} />
      </Section>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};

export default ComponentLibraryPage;
