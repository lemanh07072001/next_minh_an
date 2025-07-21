// PaginationControls.tsx
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
    previousPage: () => void;
    nextPage: () => void;
}

export function PaginationControls({
                                       currentPage,
                                       totalPages,
                                       setPage,
                                       canPreviousPage,
                                       canNextPage,
                                       previousPage,
                                       nextPage,
                                   }: PaginationControlsProps) {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-end gap-2 mt-4 flex-wrap">
            <Button
                variant="outline"
                size="sm"
                onClick={previousPage}
                disabled={!canPreviousPage}
            >
                Prev
            </Button>

            {pageNumbers.map((page) => (
                <Button
                    key={page}
                    variant={page === currentPage + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(page - 1)}
                >
                    {page}
                </Button>
            ))}

            <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={!canNextPage}
            >
                Next
            </Button>
        </div>
    );
}
