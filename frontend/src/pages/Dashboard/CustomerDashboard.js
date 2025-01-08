import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRestaurants } from '../../features/restaurantSlice';
import { addToCart } from '../../features/cartSlice';

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { restaurants, loading } = useSelector((state) => state.restaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleAddToCart = (menuItem) => {
    dispatch(addToCart(menuItem));
  };

  return (
    <div>
      <h1>Customer Dashboard</h1>
      {loading ? (
        <p>Loading restaurants...</p>
      ) : (
        <div>
          <h2>Restaurants</h2>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id} onClick={() => handleRestaurantClick(restaurant)}>
                {restaurant.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedRestaurant && (
        <div>
          <h2>{selectedRestaurant.name} Menu</h2>
          <ul>
            {selectedRestaurant.menu.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price}
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;