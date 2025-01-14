import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001; // Backend server port

app.post('/refresh-data', (req, res) => {
  const filePath = path.join('src', 'app', 'data-table-components', 'data.json');
  console.log('Refreshing data.json...');
  fs.writeFile(filePath, '', 'utf8', (err) => {});
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
