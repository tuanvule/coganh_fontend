import React, { useContext, useEffect, useRef, useState } from "react";
import { ReactFlow, Background, Controls } from '@xyflow/react';
import CustomNode from "../../modal/roadmap_modal/custom_node";
import '@xyflow/react/dist/style.css'
import {
  edges,
  nodes,
} from "../../modal/roadmap_modal/data.js"

import logo from "../../../static/img/logo.png"
import { AppContext } from "../../../context/appContext";

const nodeTypes = { custom: CustomNode };

export default function Roadmap() {
  const { history } = useContext(AppContext)
  const wrapperRef = useRef(null);
  
  const handleWheel = (event) => {
    window.scrollBy(0, event.deltaY)
  };

  return (
    <div className="relative">
      <div onClick={() => history("/menu")} className="absolute top-4 left-4 text-xl px-8 py-2 border border-[#007BFF] hover:bg-[#007BFF] transition-all rounded-sm w-fit pointing_event_br-90">Menu</div>

      <div className="h-80 text-5xl flex flex-col justify-center items-center select-none border-b border-[#007BFF]">
        <img src={logo} className="w-40 h-40" />
        <p className="text-6xl">Coganh</p>
        <p className="text-3xl mt-4">ROADMAP</p>
      </div>
      <div ref={wrapperRef} style={{ height: "3000px" }}>
        <ReactFlow
          zoomOnScroll={false}
          panOnScroll={false}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          // fitView
          onWheel={handleWheel}
        >
          <Background />
          <Controls style={{
            position: 'absolute',
            top: 20, // Đưa lên đầu, cách 10px từ trên
            left: 10, // Căn lề trái 10px
            zIndex: 10, // Đảm bảo nằm trên cùng
          }} />
        </ReactFlow>
      </div>
    </div>
  );
}
