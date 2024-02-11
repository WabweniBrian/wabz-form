import useDesigner from "@/hooks/use-designer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuHeading2 } from "react-icons/lu";
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
import { Input } from "../ui/input";

const type: ElementsType = "SubTitleField";

const extraAttributes = {
  subtitle: "Subtitle Field",
};

const propertiesSchema = z.object({
  subtitle: z.string().min(2).max(50),
});
type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export const SubTitleFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerButtonElement: {
    icon: LuHeading2,
    label: "Subtitle Field",
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
  const { subtitle } = elements.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <h1 className="text-lg font-bold">{subtitle}</h1>
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
  const { subtitle } = element.extraAttributes;
  const { updateElement } = useDesigner();

  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onChange",
    defaultValues: {
      subtitle,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { subtitle } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        subtitle,
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
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                This will act as a sub-heading for your form
              </FormDescription>
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

  const { subtitle } = element.extraAttributes;
  return <h1 className="text-lg font-bold">{subtitle}</h1>;
}
