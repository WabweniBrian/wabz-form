import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { SidebarButtonElementDragOverlay } from "./sidebar-button-element";
import { ElementsType, formElements } from "./form-elements";
import useDesigner from "@/hooks/use-designer";

const DragOverlayWrapper = () => {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
  const { elements } = useDesigner();
  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;

  let node = <div>No drag overlay</div>;

  const isSidebarButtonElement =
    draggedItem?.data.current?.isDesignerButtonElement;

  if (isSidebarButtonElement) {
    const type = draggedItem?.data.current?.type as ElementsType;
    node = <SidebarButtonElementDragOverlay formElement={formElements[type]} />;
  }

  const isDesignerElement = draggedItem?.data.current?.isDesignerElement;

  if (isDesignerElement) {
    const elementId = draggedItem?.data.current?.elementId;
    const element = elements.find((el) => el.id === elementId);
    if (!element) node = <div>Element not found</div>;
    else {
      const DesignerElementComponent =
        formElements[element.type].designerComponent;
      node = (
        <div className=" flex bg-accent border rounded-md h-auto w-full py-2 px-4 opacity-90 pointer-events-none">
          <DesignerElementComponent elementInstance={element} />
        </div>
      );
    }
  }

  return <DragOverlay>{node}</DragOverlay>;
};

export default DragOverlayWrapper;
