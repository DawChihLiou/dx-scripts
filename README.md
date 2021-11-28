# dx-scripts

A personal collection of commonly used scripts.

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
dx-scripts lighthouse [URLS]
```
It takes multiple sites' URL and run lighthouse performance analysis against the URLs.

To reduce the lighthouse [variability](https://developers.google.com/web/tools/lighthouse/variability) and produce a more reliable performance report, the script runs the performacne analysis 5 times for each URL and calculate the most representable performance report for the following matrixes:

- [Fist Contentful Paint](https://web.dev/first-contentful-paint/) (FCP)
- [Speed Index](https://web.dev/speed-index/)
- [Largest Contentful Paint](https://web.dev/lcp/) (LCP)
- [Time to Interactive](https://web.dev/interactive/) (TTI)
- [Total Blocking Time](https://web.dev/lighthouse-total-blocking-time/) (TBT)
- [Cumulative Layout Shift](https://web.dev/cls/) (CLS)
