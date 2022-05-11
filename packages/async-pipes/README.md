# Async Pipes

Composable middleware for promise based functions.

This is inspired in Vercel [useSWR](https://swr.vercel.app) and GraphQL [RESTDataSource](https://www.apollographql.com/docs/apollo-server/data/data-sources/#restdatasource-reference)

For example, the following implementation creates a pipeline that
- deduplicate concurrent requests with the same `peopleId`
- caches `https://swapi.dev/api/people/${peopleId}` response
- revalidates `https://swapi.dev/api/people/${peopleId}` when cache is stale

```
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

```


## TODOs

- add more docs
- revisit createPipeline signature
- hoist TS/ESLint/Jest configs to the root
- add a retryOnError pipe
- add a debug/logging/tap pipe
