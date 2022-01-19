import express from 'express';

const app = express();
const PORT = 8000;

app.get('/', (req, res) => res.send('Express and TypeScript Server'));

app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`);
});
