"use client";

import { FaFileExport } from "react-icons/fa";
import { Button } from "./ui/button";
import ExportModal from "./export-modal";
import { useState } from "react";

const ExportButton = ({ columns, rows }: { columns: any[]; rows: any[] }) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsExportModalOpen(true)}
        className="flex items-center gap-2"
      >
        <FaFileExport className="w-4 h-4" />
        Export to Excel
      </Button>
      <ExportModal
        isOpen={isExportModalOpen}
        setIsOpen={setIsExportModalOpen}
        columns={columns}
        rows={rows}
      />
    </>
  );
};

export default ExportButton;
