import useDesigner from "@/hooks/use-designer";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import { z } from "zod";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
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
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

const type: ElementsType = "RatingField";

const extraAttributes = {
  label: "Rating",
  helperText: "Rate your experience",
  required: true,
  maxRating: 5,
  starSize: "regular",
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(true),
  maxRating: z.number().min(1).max(10),
  starSize: z.enum(["small", "regular", "large"]),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export const RatingFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerButtonElement: {
    icon: FaStar,
    label: "Rating Field",
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
      return currentValue !== "";
    }
    return true;
  },
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const StarIcon = ({
  filled,
  onClick,
  size,
}: {
  filled: boolean;
  onClick?: () => void;
  size: string;
}) => {
  const sizeClass = {
    small: "w-4 h-4",
    regular: "w-6 h-6",
    large: "w-8 h-8",
  }[size];

  return (
    <FaStar
      className={cn(
        sizeClass,
        "cursor-pointer transition-colors",
        filled ? "text-yellow-400" : "text-gray-300",
        "hover:text-yellow-400"
      )}
      onClick={onClick}
    />
  );
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText, maxRating, starSize } =
    element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <div className="flex gap-2">
        {[...Array(maxRating)].map((_, i) => (
          <StarIcon key={i} filled={false} size={starSize} />
        ))}
      </div>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
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
      starSize: element.extraAttributes.starSize as
        | "regular"
        | "small"
        | "large",
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes as propertiesFormSchemaType);
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
              <FormDescription>The label of the field</FormDescription>
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
              <FormDescription>The helper text of the field</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Rating</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  min={1}
                  max={10}
                />
              </FormControl>
              <FormDescription>Maximum number of stars (1-10)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="starSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Star Size</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Size of the star icons</FormDescription>
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
                  Whether the user must provide a rating
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
  const [value, setValue] = useState(parseInt(defaultValue || "0"));
  const [error, setError] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const { label, required, helperText, maxRating, starSize } =
    element.extraAttributes;

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const handleRatingClick = (rating: number) => {
    setValue(rating);
    if (submitValue) {
      const valid = RatingFieldFormElement.validate(element, rating.toString());
      setError(!valid);
      submitValue(element.id, rating.toString());
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <div className="flex gap-2">
        {[...Array(maxRating)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <StarIcon
              key={index}
              filled={
                hoveredRating
                  ? ratingValue <= hoveredRating
                  : ratingValue <= value
              }
              onClick={() => handleRatingClick(ratingValue)}
              size={starSize}
            />
          );
        })}
      </div>
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
