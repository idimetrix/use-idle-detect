# **use-idle-detect**

The useIdleDetect React hook detects user inactivity within a specified timeout period. It supports both manual event tracking (e.g., mouse movement, key presses) and the Idle Detection API (if available). The hook is flexible, allowing customization of timeout duration, activity events, and providing optional callbacks for when the user becomes idle or active.

## Installation

You can install the package using **npm**, **yarn**, or **pnpm**.

```bash
pnpm add use-idle-detect

yarn install use-idle-detect

npm install use-idle-detect
```

## Usage

```tsx
import React from "react";
import { useIdleDetect } from "use-idle-detect";

const IdleComponent: React.FC = () => {
  const isIdle = useIdleDetect({
    timeout: 5000, // 5 seconds idle time
    events: ["mousemove", "keydown", "mousedown", "touchstart"], // Custom events to track
    useIdleAPI: true, // Use Idle Detection API if supported
    onIdle: () => console.log("User is idle"),
    onActive: () => console.log("User is active"),
  });

  return <div>{isIdle ? "User is idle" : "User is active"}</div>;
};

export default IdleComponent;
```

## tsup

Bundle your TypeScript library with no config, powered by esbuild.

https://tsup.egoist.dev/

## How to use this

1. install dependencies

```
# pnpm
$ pnpm install

# yarn
$ yarn install

# npm
$ npm install
```

2. Add your code to `src`
3. Add export statement to `src/index.ts`
4. Test build command to build `src`.
   Once the command works properly, you will see `dist` folder.

```zsh
# pnpm
$ pnpm run build

# yarn
$ yarn run build

# npm
$ npm run build
```

5. Publish your package

```zsh
$ npm publish
```

## test package

https://www.npmjs.com/package/use-idle-detect
