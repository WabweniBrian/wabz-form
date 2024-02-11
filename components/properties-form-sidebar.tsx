import useDesigner from "@/hooks/use-designer";
import React from "react";
import { formElements } from "./form-elements";
import { Button } from "./ui/button";
import { AiOutlineClose } from "react-icons/ai";

const PropertiesFormSidebar = () => {
  const { selectedElement, setSelectedElement } = useDesigner();
  if (!selectedElement) return null;

  const PropertiesForm =
    formElements[selectedElement?.type].propertiesComponent;
  return (
    <div className="flex flex-col p-2">
      <div className="flex-center-between">
        <p className="text-sm text-foreground/70">Properties</p>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => setSelectedElement(null)}
        >
          <AiOutlineClose />
        </Button>
      </div>
      <PropertiesForm elementInstance={selectedElement} />
    </div>
  );
};

export default PropertiesFormSidebar;
