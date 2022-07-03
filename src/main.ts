import * as core from '@actions/core';
import {context, getOctokit} from '@actions/github';

// import {PullRequestOpenedEvent} from '@octokit/webhooks-definitions/schema'

async function run(): Promise<void> {
  const octokit = getOctokit(core.getInput('access-token'));

  const pulls = await octokit.rest.pulls.list({
    state: 'open',
    owner: context.repo.owner,
    repo: context.repo.repo,
    per_page: 100,
  });

  for (const pr of pulls.data) {
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
