import { DataTable } from "./data-table-components/data-table";
import { columns } from "./data-table-components/columns";
import { getData } from "./data-table-components/data-functions";

export default async function Page() {
  const data = await getData();

  return (
    <div className="h-full flex-1 flex-col space-y-2 p-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Vulnerability Data
        </p>
      </div>
      <DataTable data={data} columns={columns} />
    </div>
  );
}