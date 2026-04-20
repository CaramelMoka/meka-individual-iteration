export default {
  spec_dir: "spec",
  spec_files: [
    "**/*[sS]pec.cjs"
  ],
  helpers: [
    "helpers/**/*.cjs"
  ],
  env: {
    stopSpecOnExpectationFailure: false,
    random: true,
    forbidDuplicateNames: true
  }
}
