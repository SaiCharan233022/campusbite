'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassModal } from '@/components/ui/GlassModal';
import { MenuItem, Canteen } from '@/types';
import { formatPrice } from '@/lib/utils';
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  UtensilsCrossed, 
  Leaf 
} from 'lucide-react';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'LUNCH',
    isVeg: true,
    isAvailable: true,
    prepTime: '10',
    canteenId: 'canteen-main',
  });

  const loadMenu = async () => {
    try {
      const [mRes, cRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/canteens'),
      ]);
      if (mRes.ok) {
        const mData = await mRes.json();
        setItems(mData.items || []);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setCanteens(cData.canteens || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          isAvailable: !item.isAvailable,
        }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!editingItem;
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit
        ? { id: editingItem.id, ...formData }
        : formData;

      const res = await fetch('/api/menu', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'LUNCH',
          isVeg: true,
          isAvailable: true,
          prepTime: '10',
          canteenId: 'canteen-main',
        });
        loadMenu();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'LUNCH',
      isVeg: true,
      isAvailable: true,
      prepTime: '10',
      canteenId: canteens[0]?.id || 'canteen-main',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      prepTime: item.prepTime.toString(),
      canteenId: item.canteenId,
    });
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to remove this menu item?')) return;
    try {
      const res = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredItems = items.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link
          href="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">Menu & Stock Control</h1>
            <p className="page-subtitle">
              Add new dishes, adjust pricing, and toggle instant stock status for students
            </p>
          </div>

          <GlassButton onClick={openAddModal} size="md">
            <Plus size={18} /> Add New Dish
          </GlassButton>
        </div>
      </div>

      {/* Search Filter */}
      <GlassCard style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
            }}
          />
          <input
            type="text"
            placeholder="Search menu items by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input"
            style={{ paddingLeft: '44px' }}
          />
        </div>
      </GlassCard>

      {/* Items Table / List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredItems.map((item) => (
          <GlassCard
            key={item.id}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className={`veg-indicator ${!item.isVeg ? 'nonveg' : ''}`} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{item.name}</h4>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>{item.canteen?.name || 'Main Canteen'}</span>
                  <span>•</span>
                  <span>⏱️ {item.prepTime}m</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {formatPrice(item.price)}
              </span>

              {/* Instant Stock Switch */}
              <button
                onClick={() => handleToggleAvailability(item)}
                className={`glass-badge ${item.isAvailable ? 'badge-available' : 'badge-unavailable'}`}
                style={{ cursor: 'pointer', padding: '6px 12px' }}
                title="Click to toggle stock availability"
              >
                {item.isAvailable ? '🟢 In Stock' : '🔴 Sold Out'}
              </button>

              <button
                onClick={() => openEditModal(item)}
                className="glass-btn glass-btn-ghost glass-btn-icon"
                title="Edit item"
              >
                <Edit3 size={16} />
              </button>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="glass-btn glass-btn-ghost glass-btn-icon"
                style={{ color: 'var(--error)' }}
                title="Delete item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add / Edit Dish Modal */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Dish Details' : 'Add New Dish to Menu'}
      >
        <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <GlassInput
            label="Dish Name"
            placeholder="e.g. Masala Dosa"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <GlassInput
            label="Description"
            placeholder="Short tasty description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-2">
            <GlassInput
              label="Price (₹ INR)"
              type="number"
              placeholder="60"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />

            <GlassInput
              label="Prep Time (mins)"
              type="number"
              placeholder="10"
              value={formData.prepTime}
              onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="glass-input"
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
                <option value="SNACKS">Snacks</option>
                <option value="BEVERAGES">Beverages</option>
                <option value="DESSERTS">Desserts</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Canteen Outlet</label>
              <select
                value={formData.canteenId}
                onChange={(e) => setFormData({ ...formData, canteenId: e.target.value })}
                className="glass-input"
              >
                {canteens.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.isVeg}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
              />
              Pure Vegetarian
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              />
              Currently In Stock
            </label>
          </div>

          <GlassButton type="submit" size="lg" style={{ marginTop: '12px' }}>
            {editingItem ? 'Save Changes' : 'Create Menu Item'}
          </GlassButton>
        </form>
      </GlassModal>
    </div>
  );
}
