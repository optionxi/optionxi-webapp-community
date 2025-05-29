import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Lucid icons
import IconButton from '@mui/material/IconButton'; // Material UI button

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

const PaginationHeatmap: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePreviousPage,
  handleNextPage,
}) => {
  return (
    <div className="flex items-center">
      <IconButton
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="rounded-full border px-4 py-2 mr-2 disabled:opacity-50"
        style={{ borderRadius: '50%' }}
      >
        <ChevronLeft color="white" />
        <span className="ml-2 text-white text-sm">Previous</span>
      </IconButton>
      <span className="mx-4 text-white text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <IconButton
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="rounded-full border px-4 py-2 ml-2 disabled:opacity-50"
        style={{ borderRadius: '50%' }}
      >
        <span className="mr-2 text-white text-sm">Next</span>
        <ChevronRight color="white" />
      </IconButton>
    </div>
  );
};

export default PaginationHeatmap;
