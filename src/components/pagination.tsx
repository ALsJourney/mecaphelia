
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type PageAndSize = {
  page: number;
  size: number;
};

type PaginationProps = {
  pagination: PageAndSize;
  onPagination: (pagination: PageAndSize) => void;
  //paginatedTicketMetadata: PaginatedTicketMetadata;
};

const Pagination = ({
  pagination,
  onPagination,
 // paginatedTicketMetadata: { count, hasNextPage },
}: PaginationProps) => {
  const startOffset = pagination.page * pagination.size + 1;
  const endOffset = startOffset - 1 + pagination.size;
  const actualOffset = Math.min(endOffset, 0);

  const label = `${startOffset}-${actualOffset} of 0`;

  const handleNextPage = () => {
    onPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  };

  const handlePreviousPage = () => {
    onPagination({
      ...pagination,
      page: pagination.page - 1,
    });
  };

  const previousButton = (
    <Button
      variant={"outline"}
      size={"sm"}
      disabled={false}
      onClick={handlePreviousPage}
    >
      Previous
    </Button>
  );

  const nextButton = (
    <Button
      variant={"outline"}
      size={"sm"}
      disabled={false}
      onClick={handleNextPage}
    >
      Next
    </Button>
  );

  const handleChangeSize = (size: string) => {
    onPagination({
      page: 0,
      size: parseInt(size),
    });
  };

  const sizeButton = (
    <Select
      onValueChange={handleChangeSize}
      defaultValue={pagination.size.toString()}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="20">20</SelectItem>
        <SelectItem value="50">50</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="w-full flex justify-between items-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex gap-x-2">
        {sizeButton}
        {previousButton}
        {nextButton}
      </div>
    </div>
  );
};

export { Pagination };
