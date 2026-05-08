import withSerwist from "@serwist/next";

const withSerwistConfig = withSerwist({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwistConfig({});
