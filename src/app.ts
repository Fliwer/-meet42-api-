import express from 'express';

const app = express();

app.listen(8080, () => {
  console.log('🚀 Express API launched on port 8080');
  console.log('http://localhost:8080/');
});