import next from "eslint-config-next";

const config = [
  ...next,
  {
    ignores: ["src/generated/prisma/**"],
  },
];

export default config;
