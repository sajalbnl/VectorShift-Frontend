// toolbar.js

import { DraggableNode } from './draggableNode';
import { nodeCategories } from './nodes/nodeRegistry';

export const PipelineToolbar = () => {
    return (
        <div className="toolbar">
            {nodeCategories.map(({ category, nodes }) => (
                <section className="toolbar__group" key={category}>
                    <h2 className="toolbar__heading">{category}</h2>
                    <div className="toolbar__items">
                        {nodes.map((config) => (
                            <DraggableNode key={config.type} config={config} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};
