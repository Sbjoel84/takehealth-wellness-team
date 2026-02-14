export default {
  extends: ["stylelint-config-standard", "stylelint-config-recommended-void"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "layer",
          "config",
          "variants",
          "responsive",
          "screen",
          "keyframes",
          "font-face",
        ],
      },
    ],
  },
};
