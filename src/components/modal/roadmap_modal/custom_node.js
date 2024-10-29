import React, { useContext, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';
import { AppContext } from '../../../context/appContext';

function CustomNode({ data = { label: "" } }) {
  const { history } = useContext(AppContext)
  const node_ref = useRef(null)

  if(node_ref.current) {
    node_ref.current.onclick = () => {
      if(data.link) {
        if(data.link.indexOf("http")) {
          window.location = data.link
        }
        else {
          history(data.link)
        }
      }
    }
  }

  return (
    <div ref={node_ref} className="hover:brightness-90" style={data.style}>
      <div>{data.label}</div>

      {data.source_pos && data.source_pos.includes("b") && <Handle type="source" position={Position.Bottom} id="sB" />}
      {data.source_pos && data.source_pos.includes("t") && <Handle type="source" position={Position.Top} id="sT" />}
      {data.source_pos && data.source_pos.includes("r") && <Handle type="source" position={Position.Right} id="sR" />}
      {data.source_pos && data.source_pos.includes("l") && <Handle type="source" position={Position.Left} id="sL" />}


      {data.target_pos && data.target_pos.includes("b") && <Handle type="target" position={Position.Bottom} id="tB" />}
      {data.target_pos && data.target_pos.includes("t") && <Handle type="target" position={Position.Top} id="tT" />}
      {data.target_pos && data.target_pos.includes("r") && <Handle type="target" position={Position.Right} id="tR" />}
      {data.target_pos && data.target_pos.includes("l") && <Handle type="target" position={Position.Left} id="tL" />}

    </div>
  );
}

export default CustomNode;