"use client";

import { useDraggable } from "@dnd-kit/core";

interface DraggableProps {
  children: React.ReactNode;
  id: number;
}

export function Draggable({ children, id }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id.toString(),
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="touch-none"
    >
      {children}
    </div>
  );
}
