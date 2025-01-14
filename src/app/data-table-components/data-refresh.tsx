export async function refreshData() {
    const response = await fetch('http://localhost:3001/refresh-data', {
      method: 'POST',
    });
    const result = await response.json();
    console.log(result);
}
