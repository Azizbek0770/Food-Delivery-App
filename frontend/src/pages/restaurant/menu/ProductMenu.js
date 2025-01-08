import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

const ProductForm = ({ product, categories, onSubmit, onCancel }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: product || {
      is_available: true,
      is_vegetarian: false,
      is_spicy: false
    }
  });

  const [preview, setPreview] = useState(product?.image || null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setValue('image', file);
      setPreview(URL.createObjectURL(file));
    }
  });

  useEffect(() => {
    if (product) {
      reset(product);
      setPreview(product.image);
    }
  }, [product, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Rasm yuklash */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mahsulot rasmi
        </label>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500"
        >
          <input {...getInputProps()} />
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="mx-auto h-32 w-32 object-cover rounded-lg"
            />
          ) : (
            <div className="space-y-2">
              <span className="material-icons text-gray-400 text-3xl">
                cloud_upload
              </span>
              <p className="text-sm text-gray-600">
                Rasm yuklash uchun bosing yoki sudrab tashlang
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Asosiy ma'lumotlar */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomi
          </label>
          <input
            type="text"
            {...register('name', { required: true })}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategoriya
          </label>
          <select
            {...register('category', { required: true })}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Narx va tayyorlash vaqti */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Narxi (so'm)
          </label>
          <input
            type="number"
            {...register('price', { required: true, min: 0 })}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tayyorlash vaqti (daqiqa)
          </label>
          <input
            type="number"
            {...register('preparation_time', { required: true, min: 1 })}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Tavsif */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tavsif
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {/* Qo'shimcha ma'lumotlar */}
      <div className="flex items-center space-x-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('is_vegetarian')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Vegetarian</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('is_spicy')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Achchiq</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('is_available')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Mavjud</span>
        </label>
      </div>

      {/* Tugmalar */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Bekor qilish
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Saqlash
        </button>
      </div>
    </form>
  );
};

export default ProductForm;