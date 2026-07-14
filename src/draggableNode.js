// draggableNode.js

export const DraggableNode = ({ config }) => {
    const { type, label, icon: Icon, accent } = config;

    const onDragStart = (event) => {
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
      event.dataTransfer.effectAllowed = 'move';
    };

    return (
      <div
        className={`palette-item palette-item--${type}`}
        style={{ '--node-accent': accent }}
        onDragStart={onDragStart}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
        {Icon && (
          <span className="palette-item__icon">
            <Icon size={16} strokeWidth={2.25} />
          </span>
        )}
        <span className="palette-item__label">{label}</span>
      </div>
    );
  };
