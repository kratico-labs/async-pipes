import React, { useEffect, useState } from 'react';

import { 
  createPipeline,
  createDedupePipe,
  createSWRPipe,
} from "@mv/async-pipes";

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

const swPeopleAPI = async (peopleId) => {
  const response = await fetch(`https://swapi.dev/api/people/${peopleId}/`)

  return response.json();
};

const useSWPeopleName = (peopleId) => {
  const [name, setName] = useState("");

  useEffect(
    () => {
      pipeline(peopleId, swPeopleAPI)
        .then(people => setName(people.name))
    },
    [peopleId]
  )

  return name;
}

export function DataComponent({peopleId}) {
  const name = useSWPeopleName(peopleId);

  return <div>People name is {name}</div>;
}
