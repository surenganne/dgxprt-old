import { ImportLocations } from "./batch-actions/ImportLocations";
import { ExportLocations } from "./batch-actions/ExportLocations";
import { BatchDeleteLocations } from "./batch-actions/BatchDeleteLocations";
import { BatchStatusUpdate } from "./batch-actions/BatchStatusUpdate";

interface LocationBatchActionsProps {
  selectedLocations: string[];
  onBatchDelete: (locationIds: string[]) => Promise<void>;
  onBatchUpdateStatus: (locationIds: string[], newStatus: string) => Promise<void>;
}

export const LocationBatchActions = ({
  selectedLocations,
  onBatchDelete,
  onBatchUpdateStatus,
}: LocationBatchActionsProps) => {
  return (
    <div className="flex gap-4 items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-100 shadow-sm">
      <ImportLocations />
      <ExportLocations selectedLocations={selectedLocations} />

      {selectedLocations.length > 0 && (
        <>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <BatchDeleteLocations
            selectedLocations={selectedLocations}
            onBatchDelete={onBatchDelete}
          />
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <BatchStatusUpdate
            selectedLocations={selectedLocations}
            onBatchUpdateStatus={onBatchUpdateStatus}
          />
        </>
      )}
    </div>
  );
};