import DataTable, { createTheme } from "react-data-table-component";
import { useMemo } from "react";
import { EmptyState, Skeleton } from "./index.jsx";
import { Loader2 } from "lucide-react";

// Custom styles that read from our CSS variables
const customStyles = {
  table: {
    style: {
      background: "var(--color-card)",
      color: "var(--color-text)",
    },
  },
  headRow: {
    style: {
      background: "var(--color-bg)",
      borderBottomColor: "var(--color-border)",
      minHeight: "44px",
    },
  },
  headCells: {
    style: {
      color: "var(--color-text-muted)",
      fontWeight: 600,
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.03em",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  rows: {
    style: {
      background: "var(--color-card)",
      color: "var(--color-text)",
      fontSize: "14px",
      minHeight: "56px",
      borderBottomColor: "var(--color-border)",
      "&:not(:last-of-type)": {
        borderBottomColor: "var(--color-border)",
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: "var(--color-primary-soft)",
      color: "var(--color-text)",
      transitionDuration: "0.15s",
      transitionProperty: "background-color",
      borderBottomColor: "var(--color-border)",
      outline: "none",
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  pagination: {
    style: {
      background: "var(--color-card)",
      color: "var(--color-text-muted)",
      borderTopColor: "var(--color-border)",
      minHeight: "56px",
    },
    pageButtonsStyle: {
      fill: "var(--color-text-muted)",
      "&:disabled": { opacity: 0.35 },
      "&:hover:not(:disabled)": {
        backgroundColor: "var(--color-primary-soft)",
      },
    },
  },
  noData: {
    style: {
      background: "var(--color-card)",
      color: "var(--color-text-muted)",
      padding: "0",
    },
  },
  progress: {
    style: {
      background: "var(--color-card)",
      color: "var(--color-text-muted)",
    },
  },
};

const paginationOptions = {
  rowsPerPageText: "Rows per page:",
  rangeSeparatorText: "of",
  noRowsPerPage: false,
  selectAllRowsItem: false,
};

export default function AppDataTable({
  columns,
  data,
  loading,
  pagination = true,
  paginationPerPage = 10,
  emptyIcon,
  emptyTitle = "No records found",
  emptyDescription = "There is nothing to show here.",
  emptyAction,
  onRowClicked,
  ...rest
}) {
  // Force a re-render when data length changes so styles reapply cleanly
  const key = useMemo(() => `${data?.length ?? 0}-${loading ? 1 : 0}`, [data, loading]);

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <DataTable
      key={key}
      columns={columns}
      data={data || []}
      customStyles={customStyles}
      pagination={pagination}
      paginationPerPage={paginationPerPage}
      paginationRowsPerPageOptions={[5, 10, 20, 50]}
      paginationComponentOptions={paginationOptions}
      highlightOnHover
      pointerOnHover={!!onRowClicked}
      onRowClicked={onRowClicked}
      responsive
      persistTableHead
      noDataComponent={
        <div className="w-full">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        </div>
      }
      {...rest}
    />
  );
}
