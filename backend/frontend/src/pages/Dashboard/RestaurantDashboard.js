import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../../features/orderSlice';
import { updateMenuItem } from '../../features/restaurantSlice';

const RestaurantDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const { menu } = useSelector((state) => state.restaurants);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleEdit = (item) => {
    setEditItem(item);
  };

  const handleUpdate = () => {
    dispatch(updateMenuItem(editItem));
    setEditItem(null);
  };

  return (
    <div>
      <h1>Restaurant Dashboard</h1>
      <h2>Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <p>Order #{order.id}</p>
              <p>Customer: {order.customer.username}</p>
              <p>Status: {order.status}</p>
            </li>
          ))}
        </ul>
      )}
      <h2>Menu</h2>
      <ul>
        {menu.map((item) => (
          <li key={item.id}>
            {editItem?.id === item.id ? (
              <>
                <input
                  type="text"
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editItem.price}
                  onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                />
                <button onClick={handleUpdate}>Save</button>
              </>
            ) : (
              <>
                {item.name} - ${item.price}
                <button onClick={() => handleEdit(item)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantDashboard;
