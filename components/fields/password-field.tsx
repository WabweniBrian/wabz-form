import useDesigner from "@/hooks/use-designer";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
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
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";

const type: ElementsType = "PasswordField";

const extraAttributes = {
  label: "Password",
  helperText: "Enter your password",
  required: true,
  placeholder: "Enter password",
  showStrengthIndicator: true,
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(true),
  placeholder: z.string().max(50),
  showStrengthIndicator: z.boolean().default(true),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export const PasswordFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerButtonElement: {
    icon: RiLockPasswordLine,
    label: "Password Field",
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
      return currentValue.length >= 6;
    }
    return true;
  },
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function calculatePasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  return strength;
}

function getPasswordStrengthColor(strength: number): string {
  if (strength <= 25) return "bg-red-500";
  if (strength <= 50) return "bg-orange-500";
  if (strength <= 75) return "bg-yellow-500";
  return "bg-green-500";
}

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, placeholder, helperText, showStrengthIndicator } =
    element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <div className="relative">
        <Input readOnly disabled type="password" placeholder={placeholder} />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto py-1 px-2"
          disabled
        >
          <IoMdEyeOff className="h-4 w-4" />
        </Button>
      </div>
      {showStrengthIndicator && <Progress value={0} className="h-1" />}
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
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>The placeholder of the field.</FormDescription>
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
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  Whether the user must enter a password
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
        <FormField
          control={form.control}
          name="showStrengthIndicator"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Password Strength Indicator</FormLabel>
                <FormDescription>
                  Show a visual indicator of password strength
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
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const { label, required, placeholder, helperText, showStrengthIndicator } =
    element.extraAttributes;

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  useEffect(() => {
    setStrength(calculatePasswordStrength(value));
  }, [value]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <div className="relative">
        <Input
          className={cn(error && "border-red-500")}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!submitValue) return;
            const valid = PasswordFieldFormElement.validate(
              element,
              e.target.value
            );
            setError(!valid);
            submitValue(element.id, e.target.value);
          }}
          onBlur={(e) => {
            if (!submitValue) return;
            const valid = PasswordFieldFormElement.validate(
              element,
              e.target.value
            );
            setError(!valid);
            submitValue(element.id, e.target.value);
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto py-1 px-2"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <IoMdEyeOff className="h-4 w-4" />
          ) : (
            <IoMdEye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showStrengthIndicator && value && (
        <div className="relative w-full h-1 bg-gray-200 rounded">
          <div
            className={cn(
              "absolute top-0 left-0 h-full rounded",
              getPasswordStrengthColor(strength)
            )}
            style={{ width: `${strength}%` }}
          />
        </div>
      )}
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
