import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      // Manzillarni yuklash
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/users/addresses/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      alert("Yangi parollar mos kelmadi");
      return;
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();
      alert("Profil muvaffaqiyatli yangilandi");
    } catch (error) {
      alert("Xatolik yuz berdi: " + error.message);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/addresses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newAddress)
      });
      
      if (response.ok) {
        setShowAddAddress(false);
        setNewAddress({ title: '', address: '', latitude: '', longitude: '' });
        fetchAddresses();
      }
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profil</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Shaxsiy ma'lumotlar</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ism
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Familiya
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Parolni o'zgartirish</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joriy parol
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yangi parol
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yangi parolni tasdiqlang
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
            >
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </form>
        </div>

        {/* Manzillar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mening manzillarim</h2>
            <button
              onClick={() => setShowAddAddress(true)}
              className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
            >
              + Yangi manzil
            </button>
          </div>

          {addresses.map(address => (
            <div key={address.id} className="border-b last:border-0 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{address.title}</h3>
                  <p className="text-gray-600 mt-1">{address.address}</p>
                </div>
                <button className="text-red-600 hover:text-red-800">
                  O'chirish
                </button>
              </div>
            </div>
          ))}

          {showAddAddress && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">Yangi manzil qo'shish</h3>
                <form onSubmit={handleAddAddress}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manzil nomi
                      </label>
                      <input
                        type="text"
                        value={newAddress.title}
                        onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                        className="w-full p-2 border rounded"
                        placeholder="Masalan: Uy, Ish"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manzil
                      </label>
                      <textarea
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                        className="w-full p-2 border rounded"
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
                    >
                      Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;