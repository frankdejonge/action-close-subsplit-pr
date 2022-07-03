import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

// import {PullRequestOpenedEvent} from '@octokit/webhooks-definitions/schema'

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
  const octokit = getOctokit(core.getInput('access-token'));
  const pulls = await octokit.rest.pulls.list({
    state: 'open',
    owner: context.repo.owner,
    repo: context.repo.repo,
    per_page: 100,
  });

  await ensureLabelExists(octokit);

  for (const pr of pulls.data) {
    if (!pr.labels.some(isLabel(subsplitPrLabel))) {
      await octokit.rest.issues.addLabels({
        ...context.repo,
        issue_number: pr.number,
        labels: [subsplitPrLabel.name],
      });
    }
    console.log(pr.labels);
    // await octokit.rest.issues.createComment({
    //   issue_number: pr.number,
    //   owner: context.repo.owner,
    //   repo: context.repo.repo,
    //   body: 'Hello from the github action!',
    // });
  }

  console.log(pulls);
  console.log(context.eventName);
  console.log(context.payload);
}

// eslint-disable-next-line github/no-then
run().catch(error => {
  if (error instanceof Error) {
    core.setFailed(error.message);
  }
});
