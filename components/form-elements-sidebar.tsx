import React from "react";
import SidebarButtonElement from "./sidebar-button-element";
import { formElements } from "./form-elements";
import { Separator } from "./ui/separator";

const FormElementsSidebar = () => {
  return (
    <div>
      <p className="text-sm text-foreground/70">Drag and Drop Elments</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          Layout Elemets
        </p>
        <SidebarButtonElement formElement={formElements.TitleField} />
        <SidebarButtonElement formElement={formElements.SubTitleField} />
        <SidebarButtonElement formElement={formElements.ParagraphField} />
        <SidebarButtonElement formElement={formElements.SeparatorField} />
        <SidebarButtonElement formElement={formElements.SpacerField} />
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          Form Elemets
        </p>
        <SidebarButtonElement formElement={formElements.TextField} />
        <SidebarButtonElement formElement={formElements.NumberField} />
        <SidebarButtonElement formElement={formElements.TextareaField} />
        <SidebarButtonElement formElement={formElements.DateField} />
        <SidebarButtonElement formElement={formElements.SelectField} />
        <SidebarButtonElement formElement={formElements.CheckboxField} />
      </div>
    </div>
  );
};

export default FormElementsSidebar;
