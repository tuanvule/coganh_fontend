import React from 'react';
import { useDrop } from 'react-dnd';

const BoardSquare = ({ id, onDrop, children, pos}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'PIECE',
    drop: (item) => {
      onDrop(item.id, id, pos)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: isOver ? '#a0a0a0' : (pos[0] >= 0 && pos[0] <= 4 && pos[1] >= 0 && pos[1] <= 4) ? '#ddd' : "rgba(0,0,0,0)",
        border: (pos[0] >= 0 && pos[0] <= 4 && pos[1] >= 0 && pos[1] <= 4) ? '1px solid #000' : "",
        // opacity: (pos[0] >= 0 && pos[0] <= 4 && pos[1] >= 0 && pos[1] <= 4) ? 1 : 0 ,
      }}
      className="w-10 h-10 bg-slate-400 -translate-x-1/2 -translate-y-1/2 relative"
    >
      {children}
    </div>
  );
};

export default BoardSquare;
