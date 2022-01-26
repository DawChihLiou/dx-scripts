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

#### `dx-scripts lighthouse`

It takes multiple URLs and run [Lighthouse](https://developers.google.com/web/tools/lighthouse) performance analysis on the URLs.

To reduce the Lighthouse [variability](https://developers.google.com/web/tools/lighthouse/variability) and produce a more reliable performance report, the script runs the performance analysis 5 times by default for each URL and calculate the most representable performance report for the following matrixes:

- [Fist Contentful Paint](https://web.dev/first-contentful-paint/) (FCP)
- [Speed Index](https://web.dev/speed-index/)
- [Largest Contentful Paint](https://web.dev/lcp/) (LCP)
- [Time to Interactive](https://web.dev/interactive/) (TTI)
- [Total Blocking Time](https://web.dev/lighthouse-total-blocking-time/) (TBT)
- [Cumulative Layout Shift](https://web.dev/cls/) (CLS)


**Arguments and Options**

```bash
Usage: dx-scripts lighthouse [options] <urls...>

Arguments:
  urls                    Lighthouse will run the analysis on the URLs.

Options:
  -i, --iteration <type>  How many times Lighthouse should run the analysis per URL (default: "5")
  -h, --help              display help for command

```

**Example**

```bash
# It will run Lighthouse 10 times on each given URLs
dx-scripts lighthouse https://dawchihliou.github.io https://github.com/DawChihLiou -i 10
```

**Use Case**

The script is suitable for release automation pipeline. For example, you can integrate `dx-scripts lighthouse` in your Pull Request to generate Lighthouse performance report on feature preview updates. You can see [more detail in this article](https://dawchihliou.github.io/articles/writing-your-own-typescript-cli#writing-a-workflow).

#### `dx-scripts image`

It takes in paths or [glob patterns](https://github.com/mrmlnc/fast-glob#pattern-syntax) to the image files and generate optimized images in the formats and the output directory you specified. 

The script will keep the output file structure and filenames as the they are under the given output directory.

This script is built on top of [sharp](https://github.com/lovell/sharp).

**Arguments and Options**

```bash
Usage: dx-scripts image [options] <paths...>

Arguments:
  paths                  file paths or glob patterns

Options:
  -o, --outdir [outdir]  Output directory (default: ".")
  --webp                 To generate .webp files (default: true)
  --avif                 To generate .avif files (default: false)
  --png                  To generate .png files (default: false)
  --jpg                  To generate .jpg files (default: false)
  --gif                  To generate animated .webp files (default: false)
  -h, --help             display help for command
```

**Example**

```bash
# File structure (before image optimization)
#
# public
# └── images
#    └── articles
#        ├── article-1
#        │   ├── image-1.png
#        │   └── image-2.png
#        └── article-2
#           ├── image-1.png
#           └── image-2.png

# Run `image` script
dx-scripts image public/images/articles/**/*.png -o public/images/optimized --avif

# File structure (after image optimization)
#
# public
# └── images
#     ├── articles
#     │    ├── article-1
#     │    │   ├── image-1.png
#     │    │   └── image-2.png
#     │    └── article-2
#     │       ├── image-1.png
#     │       └── image-2.png
#     └── optimized
#         └── articles
#             ├── article-1
#             │   ├── image-1.webp
#             │   ├── image-1.avif
#             │   ├── image-2.webp
#             │   └── image-2.avif
#             └── article-2
#                 ├── image-1.webp
#                 ├── image-1.avif
#                 ├── image-2.webp
#                 └── image-2.avif
```

**Use Case**

The script is suitable for [static site generation](https://jamstack.org/generators/) (SSG).
For example, if you are using NextJS for your static site, the `next/image` component [doesn't support image optimization at build time](https://nextjs.org/docs/api-reference/next/image#built-in-loaders) so you won't be able to use the `<Image>` component.

To generate optimized images, you can simply use `dx-scripts image` script in your `package.json` scripts.

```diff
scripts: {
+   "image": "dx-scripts image public/**/*.png -o public/optimized",
+   "prepare": "yarn image"
}
```

And run:

```
yarn
```

You'll see the generated `.webp` files in `/public/optimized` directory.
