# dx-scripts

A collection of utility scripts for developer experience and productivity.

[![npm version](https://img.shields.io/npm/v/dx-scripts.svg?style=flat)](https://www.npmjs.org/package/dx-scripts)
![npm downloads](https://img.shields.io/npm/dm/dx-scripts)

### Installation

```bash
# with npm
npm i -D dx-scripts

# or with yarn
yarn add --dev dx-scripts
```

### Scripts

#### `lighthouse`

```bash
dx-scripts lighthouse [options] <urls...>
```

It takes multiple URLs and run Lighthouse performance analysis on the URLs.

**Options**

- `-i, --iteration`: to specify how many times you want to run the analysis for each URL (default: 5)
- `-h, --help`: to see more about the command

**Example**

```bash
# It will run Lighthouse 10 times on each given URLs
dx-scripts lighthouse https://dawchihliou.github.io https://github.com/DawChihLiou -i 10
```

To reduce the Lighthouse [variability](https://developers.google.com/web/tools/lighthouse/variability) and produce a more reliable performance report, the script runs the performacne analysis 5 times for each URL and calculate the most representable performance report for the following matrixes:

- [Fist Contentful Paint](https://web.dev/first-contentful-paint/) (FCP)
- [Speed Index](https://web.dev/speed-index/)
- [Largest Contentful Paint](https://web.dev/lcp/) (LCP)
- [Time to Interactive](https://web.dev/interactive/) (TTI)
- [Total Blocking Time](https://web.dev/lighthouse-total-blocking-time/) (TBT)
- [Cumulative Layout Shift](https://web.dev/cls/) (CLS)
