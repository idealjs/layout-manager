# How to run example

## Install Deps

```
yarn
yarn add react react-dom -P
```
## Build layout-manager 

```
yarn build
```
or
```
yarn build:webpack
```

### Create link
```
yarn link
```

### Link layout-manager
```
cd example
yarn link @idealjs/layout-manager
```

### Link react react-dom
```
cd example
yarn
npm link ../node_modules/react
npm link ../node_modules/react-dom
```
### Start

```
yarn start
```
