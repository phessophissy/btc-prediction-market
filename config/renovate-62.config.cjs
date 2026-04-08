module.exports = {
  extends: ['config:base'],
  labels: ['dependencies'],
  automerge: false,
  rangeStrategy: 'pin',
  packageRules: [
    { matchPackagePatterns: ['@stacks/*'], groupName: 'Stacks SDK', automerge: false },
    { matchUpdateTypes: ['patch'], automerge: true, automergeType: 'branch' },
  ],
  schedule: ['before 7am on Monday'],
};
