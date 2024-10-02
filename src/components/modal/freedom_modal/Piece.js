import React from 'react';
import { useDrag } from 'react-dnd';

const Piece = ({ id, side, is_stored = false }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PIECE',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  
  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: is_stored ? "30px" : '60px',
        height: is_stored ? "30px" : '60px',
        backgroundColor: side === 1 ? 'blue' : "red",
        textAlign: 'center',
        lineHeight: '50px',
      }}
      className={`${!is_stored && "translate-x-[-11px] translate-y-[-11px]"} rounded-full`}
    >
    </div>
  );
};

export default Piece;
