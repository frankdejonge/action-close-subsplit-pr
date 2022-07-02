import * as core from '@actions/core';
import { context, getInput, getOctokit } from '@actions/github';

// import {PullRequestOpenedEvent} from '@octokit/webhooks-definitions/schema'

async function run(): Promise<void> {
  const octokit = getOctokit(getInput('access-token'));
  const pulls = await octokit.rest.pulls.list({
    state: 'open',
    repo: context.repo.repo,
    owner: context.repo.owner,
    per_page: 100,
  });

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
