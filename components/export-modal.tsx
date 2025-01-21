import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";

interface ExportModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  columns: {
    id: string;
    label: string;
    type: string;
  }[];
  rows: any[];
}

const ExportModal = ({
  isOpen,
  setIsOpen,
  columns,
  rows,
}: ExportModalProps) => {
  const [fileName, setFileName] = useState("form-submissions");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map((col) => col.id)
  );

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((current) =>
      current.includes(columnId)
        ? current.filter((id) => id !== columnId)
        : [...current, columnId]
    );
  };

  const handleExport = () => {
    // Filter rows to only include selected columns
    const filteredData = rows.map((row) => {
      const newRow: any = {};
      selectedColumns.forEach((colId) => {
        const column = columns.find((col) => col.id === colId);
        if (column) {
          // Format special field types
          switch (column.type) {
            case "DateField":
              newRow[column.label] = row[colId]
                ? format(new Date(row[colId]), "dd/MM/yyyy")
                : "";
              break;
            case "CheckboxField":
            case "ToggleField":
              newRow[column.label] = row[colId] === "true" ? "Yes" : "No";
              break;
            case "MultiCheck":
              try {
                const values = JSON.parse(row[colId]);
                newRow[column.label] = values.join(", ");
              } catch {
                newRow[column.label] = row[colId];
              }
              break;
            case "PasswordField":
              newRow[column.label] = "[REDACTED]";
              break;
            case "RatingField":
              newRow[column.label] = `${row[colId]} stars`;
              break;
            default:
              newRow[column.label] = row[colId];
          }
        }
      });
      return newRow;
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Submissions");

    // Save file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export to Excel</DialogTitle>
          <DialogDescription>
            Select the columns you want to export and specify a file name.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Select Columns</Label>
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
              {columns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={selectedColumns.includes(column.id)}
                    onCheckedChange={() => handleColumnToggle(column.id)}
                  />
                  <label
                    htmlFor={column.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={selectedColumns.length === 0}
          >
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
