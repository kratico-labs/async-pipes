import React from 'react';

import { DataComponent } from './DataComponent';

export function App() {
  return (
    <>
      <div>Note a that single API call is made for each person</div>
      <DataComponent peopleId={1} />
      <DataComponent peopleId={1} />
      <DataComponent peopleId={1} />
      <DataComponent peopleId={2} />
      <DataComponent peopleId={2} />
      <DataComponent peopleId={2} />
    </>
  );
}
