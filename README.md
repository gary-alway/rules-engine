# rules engine

Product rules engine

## Environment setup

```bash
yarn local:up
```

![architecture](./design/architecture.svg)

```bash
# tear down localstack docker container
yarn local:down
```

## Testing

### Acceptance tests

```bash
yarn dev

yarn test:acceptance
```

### Unit tests

```bash
yarn test
```
