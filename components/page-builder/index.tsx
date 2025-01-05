'use client';
// components/DraggableList.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type Item = {
  id: string;
  content: string;
};

const initialItems: Item[] = [
  { id: '1', content: 'آیتم ۱' },
  { id: '2', content: 'آیتم ۲' },
  { id: '3', content: 'آیتم ۳' },
  { id: '4', content: 'آیتم ۴' },
];

const DraggableList: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setItems(reorderedItems);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              padding: 0,
              width: 250,
              margin: '0 auto',
              listStyleType: 'none',
            }}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      userSelect: 'none',
                      padding: '16px',
                      margin: '8px 0',
                      backgroundColor: '#ffffff',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      ...provided.draggableProps.style,
                    }}
                  >
                    {item.content}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableList;
