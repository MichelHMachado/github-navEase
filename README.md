# GitHub NavEase
Is a extension made to easy the navigation througt repositories.
It also displays the repos that you are the author separated from the
repos you are not the author. Both organized alphabeticaly.
After creating the personal acess token, insert it to the extension and 
go to a differente github page and open the extension again.
While already functional, GitHub NavEase is constantly evolving with 
ongoing improvements planned for the future. 

# Instructions to create your personal access token:

1. Sign in to your GitHub account.
2. Click on your profile photo in the upper-right corner of any page, then click on Settings.
3. In the left sidebar, click on Developer settings.
4. In the left sidebar, click on Personal access tokens.
5. Click on Generate new token.
6. Give your token a descriptive name in the Note field.
7. Under the Select scopes, check the following options:
   - repo (Full control of private repositories)
   - repo:status (Access commit status)
   - repo_deployment (Access deployment status)
   - public_repo (Access public repositories)
   - repo:invite (Access repository invitations)
   - security_events (Read and write security events)
   - admin:org (Full control of orgs and teams, read and write org projects)
   - write:org (Read and write org and team membership, read and write org    projects)
   - read:org (Read org and team membership, read org projects)
   - manage_runners:org (Manage org runners and runner groups)
   - read:user
8. Click on Generate token.
9. Copy the token to your clipboard. For security reasons, after you navigate off the page, you will not be able to see the token again.

# Contributing
GitHub NavEase is an open-source project, and contributions are welcome. Whether you're interested in adding new features, fixing bugs, or improving documentation, your contributions are invaluable. Feel free to fork the repository, make your changes, and submit a pull request.

# Development

1. Run `pnpm install` to  install dependencies
2. Run `npm run build` to build the extension
3. Head to the extensions page of your browser (ex:
   `edge://extensions/`)
4. Enable developer mode
5. Click `Load unpacked` and select the `dist` folder of this project
6. Make your changes to the codebase
7. When done with your changes, run: `npm run dev` The project will automatically reload the page whenever there are code changes.
8. Head back to the page you want to test the extension on