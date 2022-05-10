# Async Data Pipes

# Async Collapse

```
const data = await asyncCollapse(key, asyncFn);


const data = await asyncCollapse(key, asyncFn, { cache: new Map() });
const data = await asyncCollapse(key, asyncFn, { middleware: [a, b, c] });

const pipeline = createDataPipe(
    // collapse
    // stale while revalidate
    // .json
    // fetch
)

(args, next): Promise => {
    next(...args);
}

```