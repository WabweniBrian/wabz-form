import React, { useState } from "react";
import { FormElementInstance, formElements } from "./form-elements";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Button } from "./ui/button";
import { BiSolidTrash } from "react-icons/bi";
import useDesigner from "@/hooks/use-designer";
import { cn } from "@/lib/utils";

const DesignerElementWrapper = ({
  element,
}: {
  element: FormElementInstance;
}) => {
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  const DesignElement = formElements[element.type].designerComponent;
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="relative min-h-[120px] flex flex-col hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute  w-full h-1/2 rounded-t-md"
      />
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute  w-full h-1/2 rounded-b-md bottom-0"
      />
      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full z-10">
            <Button
              className="absolute -top-1 -right-1 z-10 h-6 w-6 p-0"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
                setSelectedElement(null);
              }}
            >
              <BiSolidTrash className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse z-10">
            <p className="text-sm">Click for properties or drag to move</p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md rounded-b-none h-[7px] bg-gradient-to-r from-indigo-400 to-cyan-400" />
      )}
      <div
        className={cn(
          "flex w-full min-h-[120px] items-center rounded-md bg-accent/20 px-4 py-2 pointer-events-none opacity-100",
          mouseIsOver && "opacity-20"
        )}
      >
        <DesignElement elementInstance={element} />
      </div>
      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md rounded-t-none h-[7px] bg-gradient-to-r from-indigo-400 to-cyan-400" />
      )}
    </div>
  );
};

export default DesignerElementWrapper;
