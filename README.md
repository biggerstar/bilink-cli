### bi-link

#### Installation

***

```
// with npm
npm i bilink-cli

// with yarn
yarn add bilink-cli
```

#### Development

***

- Use `bilink create` or `bilink c` to create a new micro module
- Use `billink` or `bilink serve` or `bilink s` to start your server. You can append the name of the module you want to
  start
- Use `bilink preview` or `bilink p` to view the preview of the build product
- Use `bilink build` or `bilink b` to compile the specified micro module and output it to the specified folder

#### Config

***

- Each micro module created has a `vite.js` configuration file. The configuration returned by this file is the same as the
  original configuration of vite. Developers can override the original vite configuration by customizing this file
  configuration and take effect on the micro modules in the same folder

