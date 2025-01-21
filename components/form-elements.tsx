import { CheckboxFieldFormElement } from "./fields/checkbox-field";
import { DateFieldFormElement } from "./fields/date-field";
import { EmailFieldFormElement } from "./fields/email-field";
import { MultiCheckFormElement } from "./fields/multi-check-field";
import { NumberFieldFormElement } from "./fields/number-field";
import { ParagraphFieldFormElement } from "./fields/paragraph-field";
import { PasswordFieldFormElement } from "./fields/password-field";
import { RadioGroupFormElement } from "./fields/radio-group-field";
import { RatingFieldFormElement } from "./fields/rating-field";
import { SelectFieldFormElement } from "./fields/select-field";
import { SeparatorFieldFormElement } from "./fields/separator-field";
import { SpacerFieldFormElement } from "./fields/spacer-field";
import { SubTitleFieldFormElement } from "./fields/subtitle-field";
import { TextFieldFormElement } from "./fields/text-field";
import { TextareaFieldFormElement } from "./fields/textarea-field";
import { TitleFieldFormElement } from "./fields/title-field";
import { ToggleFieldFormElement } from "./fields/toggle-field";

export type ElementsType =
  | "TextField"
  | "EmailField"
  | "PasswordField"
  | "TitleField"
  | "SubTitleField"
  | "ParagraphField"
  | "SeparatorField"
  | "SpacerField"
  | "NumberField"
  | "TextareaField"
  | "DateField"
  | "SelectField"
  | "CheckboxField"
  | "MultiCheck"
  | "RadioGroup"
  | "RatingField"
  | "ToggleField";

export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
  type: ElementsType;

  construct: (id: string) => FormElementInstance;

  designerButtonElement: {
    icon: React.ElementType;
    label: string;
  };

  designerComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  formComponent: React.FC<{
    elementInstance: FormElementInstance;
    submitValue?: (key: string, value: string) => void;
    isInvalid?: boolean;
    defaultValue?: string;
  }>;
  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;

  validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, any>;
};

type FormElemetsType = {
  [key in ElementsType]: FormElement;
};

export const formElements: FormElemetsType = {
  TextField: TextFieldFormElement,
  EmailField: EmailFieldFormElement,
  PasswordField: PasswordFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  NumberField: NumberFieldFormElement,
  TextareaField: TextareaFieldFormElement,
  DateField: DateFieldFormElement,
  SelectField: SelectFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
  MultiCheck: MultiCheckFormElement,
  RadioGroup: RadioGroupFormElement,
  RatingField: RatingFieldFormElement,
  ToggleField: ToggleFieldFormElement,
};
