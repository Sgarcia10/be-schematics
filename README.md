# rpp-schematics

## Description

## Preinstall

Stay connected to Rappi VPN PROD.

Generate .npmrc file to install Nexus dependencies.
```bash
$ npm run create-npmrc
```


## Installation



```bash
$ npm install
```

## Running the app

It is possible to inject env vars through the *.env* file. So you can duplicate the *.env.example* in the project's root path and rename it to *.env*.

Remember to inject the env var `APM=signalfx`, this will setup *signalfx* as the application monitor. Otherwise, *newrelic* will be setup by default and it will show some warnings aboout the *newrelic* library configuration.

```bash
# development
$ npm run start:dev

# production mode
$ npm run build
$ npm run start
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
