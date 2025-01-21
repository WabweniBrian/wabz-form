import { getFormById, getFormWithSubmissions } from "@/actions/form";
import ExportButton from "@/components/export-button";
import { ElementsType, FormElementInstance } from "@/components/form-elements";
import FormLinkShare from "@/components/form-link-share";
import StatsCard from "@/components/stats-card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VisitButton from "@/components/visit-button";
import { format, formatDistance } from "date-fns";
import { ReactNode } from "react";
import { FaStar, FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { LuView } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import { TbArrowBounce } from "react-icons/tb";

const FormDetails = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { id } = params;
  const form = await getFormById(Number(id));
  if (!form) throw new Error("form not found");

  const { visits, submissions } = form;

  let submissionRate = 0;
  let bounceRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
    bounceRate = 100 - submissionRate;
  }

  return (
    <div className="mx-auto max-w-7xl px-2">
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitButton shareUrl={form.shareUrl} />
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="mx-auto flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={form.shareUrl} />
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total visits"
          icon={<LuView className="text-blue-600" />}
          helperText="All time form visits"
          value={visits.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-blue-600"
        />

        <StatsCard
          title="Total submissions"
          icon={<FaWpforms className="text-yellow-600" />}
          helperText="All time form submissions"
          value={submissions.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-yellow-600"
        />

        <StatsCard
          title="Submission rate"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="Visits that result in form submission"
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-green-600"
        />

        <StatsCard
          title="Bounce rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="Visits that leaves without interacting"
          value={bounceRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-red-600"
        />
      </div>

      <div className="pt-10">
        <SubmissionsTable id={form.id} />
      </div>
    </div>
  );
};

export default FormDetails;

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

const SubmissionsTable = async ({ id }: { id: number }) => {
  const form = await getFormWithSubmissions(id);

  if (!form) {
    throw new Error("form not found");
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextareaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
      case "EmailField":
      case "PasswordField":
      case "MultiCheck":
      case "RadioGroup":
      case "RatingField":
      case "ToggleField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = [];
  form.FormSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Submissions</h1>
        <ExportButton columns={columns} rows={rows} />
      </div>
      <div className="rounded-md grid grid-cols-1 border overflow-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const RowCell = ({ type, value }: { type: ElementsType; value: string }) => {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;

    case "CheckboxField":
    case "ToggleField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;

    case "MultiCheck":
      try {
        const values = JSON.parse(value) as string[];
        node = (
          <div className="flex flex-wrap gap-1">
            {values.map((val, i) => (
              <Badge key={i} variant="outline">
                {val}
              </Badge>
            ))}
          </div>
        );
      } catch {
        node = value;
      }
      break;

    case "RadioGroup":
      node = <Badge variant="outline">{value}</Badge>;
      break;

    case "RatingField":
      const rating = parseInt(value);
      node = (
        <div className="flex gap-1">
          {[...Array(rating)].map((_, i) => (
            <FaStar key={i} className="w-4 h-4 text-yellow-400" />
          ))}
        </div>
      );
      break;

    case "PasswordField":
      node = value ? "••••••••" : "";
      break;

    case "EmailField":
      node = (
        <span className="text-blue-500 hover:underline">
          <MdAlternateEmail className="inline mr-1" />
          {value}
        </span>
      );
      break;

    default:
      break;
  }

  return <TableCell>{node}</TableCell>;
};
