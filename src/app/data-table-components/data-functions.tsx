// "use client";
import fs from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "../../db/schema";

const db = drizzle(process.env.DATABASE_URL!);  // Ensure DATABASE_URL is set in .env

export async function fetchFromDatabase() {
  try {
    const users = await db.select().from(usersTable);
    return users;
  } catch (error) {
    console.error("Error fetching from the database:");
    return [];  // Fallback if DB fetch fails
  }
}

export async function updateDataFile() {
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

export async function getData() {
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


export async function getDataAPI() {
  const response = await fetch('/api/get-data');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await response.json();
  console.log(data);
  return data;
}