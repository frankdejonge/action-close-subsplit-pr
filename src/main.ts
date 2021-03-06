import * as core from '@actions/core';
import {context, getOctokit} from '@actions/github';

async function ensureLabelExists(octokit) {
  const labels = await octokit.rest.issues.listLabelsForRepo({
    ...context.repo,
  });

  if (labels.data.some(isLabel(subsplitPrLabel))) {
    return;
  }

  await octokit.rest.issues.createLabel({
    ...context.repo,
    ...subsplitPrLabel,
  });
}

const subsplitPrLabel = {
  name: 'Sub-split PR',
  color: '000000',
  description: 'PR that targets a sub-split branch',
};
type Label = typeof subsplitPrLabel;
const isLabel =
  (a: Label) =>
  (b: Label): boolean =>
    a.name === b.name;

async function run(): Promise<void> {
  const octokit = getOctokit(core.getInput('access_token'));
  const closePr = core.getInput('close_pr') === 'yes';
  const message = core.getInput('message');
  const matchBranch = new RegExp(core.getInput('target_branch_match'));
  const pulls = await octokit.rest.pulls.list({
    state: 'open',
    owner: context.repo.owner,
    repo: context.repo.repo,
    per_page: 100,
  });

  await ensureLabelExists(octokit);

  for (const pr of pulls.data) {
    if (!matchBranch.test(pr.base.ref)) {
      continue;
    }
    if (!pr.labels.some(isLabel(subsplitPrLabel))) {
      await octokit.rest.issues.addLabels({
        ...context.repo,
        issue_number: pr.number,
        labels: [subsplitPrLabel.name],
      });

      await octokit.rest.issues.createComment({
        issue_number: pr.number,
        ...context.repo,
        body: message,
      });
    }

    if (closePr) {
      await octokit.rest.pulls.update({
        ...context.repo,
        pull_number: pr.number,
        state: 'closed',
      });
    }
  }
}

// eslint-disable-next-line github/no-then
run().catch(error => {
  if (error instanceof Error) {
    core.setFailed(error.message);
  }
});
