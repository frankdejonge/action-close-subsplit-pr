# Action to close sub-split PR's

```yaml
on:
  schedule:
    - cron: '30 7 * * *'

jobs:
  close_subsplit_prs:
    runs-on: ubuntu-latest
    name: Close sub-split PRs
    steps:
      - uses: frankdejonge/action-close-subsplit-pr@0.0.1
        with:
          # close_pr: 'no' // Uncomment to prevent closing PRs
          # access_token: '{{ secrets.GH_PAT }}' // Uncomment to use self-defined access token, default: ${{ github.token }}
          # target_branch_match: '.+' // Uncomment to supply your own PR target branch filter
          message: |
            This is where you can supply your own message to notify your contributor they PR'd the wrong repository.
```
