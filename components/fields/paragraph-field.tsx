import useDesigner from "@/hooks/use-designer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsTextParagraph } from "react-icons/bs";
import { z } from "zod";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../form-elements";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

const type: ElementsType = "ParagraphField";

const extraAttributes = {
  text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium iste minima, quae ratione dolorem odit incidunt quod soluta doloribus unde",
};

const propertiesSchema = z.object({
  text: z.string().min(2).max(1000),
});
type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export const ParagraphFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerButtonElement: {
    icon: BsTextParagraph,
    label: "Paragraph Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

// Designer Component---------------------------------------------------------------------------------------------------------------
function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const elements = elementInstance as CustomInstance;
  const { text } = elements.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <p>{text}</p>
    </div>
  );
}

// Propeties Component---------------------------------------------------------------------------------------------------------------
function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { text } = element.extraAttributes;
  const { updateElement } = useDesigner();

  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onChange",
    defaultValues: {
      text,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { text } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        text,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormDescription>This is the paragraph text</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

// Form Component---------------------------------------------------------------------------------------------------------------
function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const { text } = element.extraAttributes;
  return <p>{text}</p>;
}
