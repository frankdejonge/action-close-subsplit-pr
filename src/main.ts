import * as core from '@actions/core';
import {context, getOctokit} from '@actions/github';
import { Octokit } from '@octokit/core';

// import {PullRequestOpenedEvent} from '@octokit/webhooks-definitions/schema'

async function ensureLabelExists(octokit) {
  const labels = await octokit.rest.issues.listLabelsForRepo({
    repo: context.repo.repo,
    owner: context.repo.owner,
  });

  console.log(labels);
}

const subsplitPrLabel = {
  name: 'Sub-split PR',
  color: '000000',
};

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
    const isLabelled = pr.label.some(label => label.name === subsplitPrLabel.name);

    if ( ! isLabelled) {
      console.log('not labeled');
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
