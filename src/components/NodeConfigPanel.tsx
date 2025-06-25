import React from 'react';

const nodeTypes = ['Start', 'Send Email', 'Delay', 'Webhook', 'Decision', 'End'];

const NodeSidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ width: 150, padding: 10, borderRight: '1px solid #ccc' }}>
      <h4>Nodes</h4>
      {nodeTypes.map((type) => (
        <div
          key={type}
          onDragStart={(e) => onDragStart(e, type)}
          draggable
          style={{
            marginBottom: 8,
            padding: '8px 12px',
            border: '1px solid #aaa',
            borderRadius: 4,
            background: '#f0f0f0',
            cursor: 'grab',
          }}
        >
          {type}
        </div>
      ))}
    </div>
  );
};

export default NodeSidebar;
