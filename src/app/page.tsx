import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { DataTable } from "./data-table-components/data-table";
import { columns } from "./data-table-components/columns";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "../db/schema";

export const metadata: Metadata = {
  title: "Expenses",
  description: "An Expense tracker built using Tanstack Table."
};

const db = drizzle(process.env.DATABASE_URL!);  // Ensure DATABASE_URL is set in .env

async function fetchFromDatabase() {
  try {
    const users = await db.select().from(usersTable);
    return users;
  } catch (error) {
    console.error("Error fetching from the database:");
    return [];  // Fallback if DB fetch fails
  }
}

async function updateDataFile() {
  try {
    // Fetch data from the database
    const data = await fetchFromDatabase(); 

    if (data.length === 0) {
      console.error("No data fetched from the database.");
      return;
    }

    const filePath = path.join(process.cwd(), "src", "app", "data-table-components", "data.json");

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log("Data has been updated in data.json");
  } catch (error) {
    console.error("Error updating data file:");
  }
}

async function getData() {
  const filePath = path.join(process.cwd(), "src", "app", "data-table-components", "data.json");

  // Check if the data.json file exists
  if (!fs.existsSync(filePath)) {
    console.log("data.json does not exist, fetching and saving data...");
    await updateDataFile(); 
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    if (!data.trim()) {
      console.error("data.json is empty or malformed.");
      await updateDataFile();  // Regenerate data from the database if file is empty or corrupted
      return [];  // Return empty array if invalid data
    }

    // Try parsing JSON and return it if successful
    return JSON.parse(data); 
  } catch (error) {
    console.error("Error parsing JSON data");
    await updateDataFile();  // Regenerate data from the database if JSON parsing fails
    return [];  // Return empty array if parsing fails
  }
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="h-full flex-1 flex-col space-y-2 p-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Here&apos;s a list of your expenses for this month!
        </p>
      </div>
      <DataTable data={data} columns={columns} />
    </div>
  );
}
