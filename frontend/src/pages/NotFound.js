import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-500">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">
          Sahifa topilmadi
        </h2>
        <p className="text-gray-600 mt-2 mb-8">
          Kechirasiz, siz qidirayotgan sahifa mavjud emas
        </p>
        <Link to="/">
          <Button variant="primary">
            Bosh sahifaga qaytish
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 