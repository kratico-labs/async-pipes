const { 
  createPipeline,
  createDedupePipe,
  createSWRPipe,
} = require("@mv/async-pipes");
const axios = require("axios");

const express = require('express');
const app = express();
const port = 3000;

const pipeline = createPipeline([
  createDedupePipe({
    cache: new Map(),
    serialize: (v) => JSON.stringify(v),
  }),
  createSWRPipe({
    cache: new Map(),
    serialize: (v) => JSON.stringify(v),
    cacheTime: 60000,
    staleTime: 10 * 60000,
  }),
]);

app.get('/api/people/:peopleId', async (req, res) => {
  const response = await pipeline(
    req.params.peopleId,
    (peopleId) => axios.get(`https://swapi.dev/api/people/${peopleId}/`),
  );

  res.json(response.data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
