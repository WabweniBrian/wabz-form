import useDesigner from "@/hooks/use-designer";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { LuRadio } from "react-icons/lu";
import { z } from "zod";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../form-elements";
import { Button } from "../ui/button";
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
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

const type: ElementsType = "RadioGroup";

const extraAttributes = {
  label: "Radio Group",
  helperText: "Select one option",
  required: false,
  options: [],
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  options: z.array(z.string()).default([]),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export const RadioGroupFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerButtonElement: {
    icon: LuRadio,
    label: "Radio Group",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue.length > 0;
    }
    return true;
  },
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText, options } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <RadioGroup className="flex flex-col gap-2">
        {options.map((option, index) => (
          <div key={`${option}-${index}`} className="flex items-center gap-2">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
      {helperText && (
        <p className="text-muted-foreground text-sm">{helperText}</p>
      )}
    </div>
  );
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onChange",
    defaultValues: {
      ...element.extraAttributes,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAttributes: values,
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the
                field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper text</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The helper text of the field. <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Options</FormLabel>
                <Button
                  variant={"outline"}
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    const newOptions = [...field.value, "New option"];
                    form.setValue("options", newOptions, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    applyChanges({
                      ...form.getValues(),
                      options: newOptions,
                    });
                  }}
                >
                  <AiOutlinePlus />
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {field.value.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-1"
                  >
                    <Input
                      placeholder=""
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...field.value];
                        newOptions[index] = e.target.value;
                        form.setValue("options", newOptions, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                        applyChanges({
                          ...form.getValues(),
                          options: newOptions,
                        });
                      }}
                    />
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={(e) => {
                        e.preventDefault();
                        const newOptions = field.value.filter(
                          (_, i) => i !== index
                        );
                        form.setValue("options", newOptions, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                        applyChanges({
                          ...form.getValues(),
                          options: newOptions,
                        });
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  Whether the user must select an option
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { label, required, helperText, options } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <RadioGroup
        className="flex flex-col gap-2"
        defaultValue={value}
        onValueChange={(value) => {
          setValue(value);
          if (!submitValue) return;
          const valid = RadioGroupFormElement.validate(element, value);
          setError(!valid);
          submitValue(element.id, value);
        }}
      >
        {options.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <RadioGroupItem value={option} id={`${element.id}-${option}`} />
            <Label
              htmlFor={`${element.id}-${option}`}
              className="cursor-pointer"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {helperText && (
        <p
          className={cn(
            "text-muted-foreground text-[0.8rem]",
            error && "text-red-500"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
