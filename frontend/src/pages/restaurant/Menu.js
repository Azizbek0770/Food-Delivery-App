import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchProducts } from '../../store/slices/restaurantSlice';
import CategoryList from '../../components/restaurant/menu/CategoryList';
import ProductList from '../../components/restaurant/menu/ProductList';
import ProductForm from '../../components/restaurant/menu/ProductForm';
import Modal from '../../components/common/Modal';

const Menu = () => {
  const dispatch = useDispatch();
  const { categories, products, loading } = useSelector(state => state.restaurant);
  const { user } = useSelector(state => state.auth);
  const restaurantId = user.restaurants[0]?.id;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchCategories(restaurantId));
      dispatch(fetchProducts(restaurantId));
    }
  }, [dispatch, restaurantId]);

  const handleProductSubmit = async (data) => {
    try {
      if (editingProduct) {
        // Mahsulotni yangilash
        await dispatch(updateProduct({
          restaurantId,
          productId: editingProduct.id,
          data
        })).unwrap();
      } else {
        // Yangi mahsulot qo'shish
        await dispatch(createProduct({
          restaurantId,
          data
        })).unwrap();
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      dispatch(fetchProducts(restaurantId));
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleCategorySubmit = async (data) => {
    try {
      if (editingCategory) {
        await dispatch(updateCategory({
          restaurantId,
          categoryId: editingCategory.id,
          data
        })).unwrap();
      } else {
        await dispatch(createCategory({
          restaurantId,
          data
        })).unwrap();
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      dispatch(fetchCategories(restaurantId));
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Menu boshqaruvi</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setEditingCategory(null);
              setIsCategoryModalOpen(true);
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
          >
            <span className="material-icons">add</span>
            <span>Yangi kategoriya</span>
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
          >
            <span className="material-icons">add</span>
            <span>Yangi mahsulot</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Kategoriyalar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Kategoriyalar</h2>
            <CategoryList
              categories={categories}
              onEdit={(category) => {
                setEditingCategory(category);
                setIsCategoryModalOpen(true);
              }}
              onDelete={async (categoryId) => {
                if (window.confirm('Kategoriyani o\'chirmoqchimisiz?')) {
                  try {
                    await dispatch(deleteCategory({
                      restaurantId,
                      categoryId
                    })).unwrap();
                    dispatch(fetchCategories(restaurantId));
                  } catch (error) {
                    console.error('Failed to delete category:', error);
                  }
                }
              }}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>

        {/* Mahsulotlar */}
        <div className="lg:col-span-3">
          <ProductList
            products={products.filter(p => 
              !selectedCategory || p.category === selectedCategory.id
            )}
            onEdit={(product) => {
              setEditingProduct(product);
              setIsProductModalOpen(true);
            }}
            onDelete={async (productId) => {
              if (window.confirm('Mahsulotni o\'chirmoqchimisiz?')) {
                try {
                  await dispatch(deleteProduct({
                    restaurantId,
                    productId
                  })).unwrap();
                  dispatch(fetchProducts(restaurantId));
                } catch (error) {
                  console.error('Failed to delete product:', error);
                }
              }
            }}
          />
        </div>
      </div>

      {/* Mahsulot qo'shish/tahrirlash modali */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
      >
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={handleProductSubmit}
          onCancel={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
        />
      </Modal>

      {/* Kategoriya qo'shish/tahrirlash modali */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={handleCategorySubmit}
          onCancel={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Menu;