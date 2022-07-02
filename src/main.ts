import * as core from '@actions/core';
import {wait} from './wait';
import * as github from '@actions/github';
// import {PullRequestOpenedEvent} from '@octokit/webhooks-definitions/schema'

async function run(): Promise<void> {
  try {
    console.log(github.context.eventName);
    const ms: string = core.getInput('milliseconds');
    core.debug(`Waiting ${ms} milliseconds ...`); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString());
    await wait(parseInt(ms, 10));
    core.debug(new Date().toTimeString());

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
