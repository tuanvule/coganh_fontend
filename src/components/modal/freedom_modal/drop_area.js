import React from 'react';
import { useDrop } from 'react-dnd';

const DropArea = ({ onDrop, children, side }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'PIECE',
      drop: (item) => onDrop(item.id, null, null),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));
  
    return (
      <div
        ref={drop}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: isOver ? '#ffa' : '#f0f0f0',
          border: '2px dashed #000',
        }}
        className="grid grid-cols-4 grid-flow-row items-center justify-items-center"
      >
        {children}
      </div>
    );
  };
  
export default DropArea