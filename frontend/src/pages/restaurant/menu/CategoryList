import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCategory } from '../../../store/slices/restaurantSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Yangi tartibni saqlash
    items.forEach((item, index) => {
      if (item.order !== index) {
        dispatch(updateCategory({
          ...item,
          order: index
        }));
      }
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="categories">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {categories.map((category, index) => (
              <Draggable
                key={category.id}
                draggableId={category.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="bg-white rounded-lg shadow-sm border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div {...provided.dragHandleProps}>
                          <span className="material-icons text-gray-400 cursor-move">
                            drag_indicator
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-gray-600">
                            {category.products_count} ta mahsulot
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEdit(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          onClick={() => onDelete(category.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CategoryList;