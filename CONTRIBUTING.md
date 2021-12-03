# Contributing to dx-scripts

### Installation

```bash
yarn
```

### Development

To test the scripts, please run:

```bash
yarn build
```

to compile the TypeScript files in `/src`. The output directory is `/bin`.

At the project root, please run:

```bash
yarn link
```

to register the command locally so that you can execute the command with `dx-scripts`. For example:

```bash
dx-scripts lighthouse https://dawchihliou.github.io -i 1
```

You can always unregister the command by running:

```bash
yarn unlink
```
