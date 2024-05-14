type TokenInstructionsType = {
  step: number;
  description: string;
  substeps?: string[];
};
export const tokenInstructions: TokenInstructionsType[] = [
  {
    step: 1,
    description: 'Sign in to your GitHub account.',
  },
  {
    step: 2,
    description: 'Click on your profile photo in the upper-right corner of any page, then click on Settings.',
  },
  {
    step: 3,
    description: 'In the left sidebar, click on Developer settings.',
  },
  {
    step: 4,
    description: 'In the left sidebar, click on Personal access tokens.',
  },
  {
    step: 5,
    description: 'Click on Generate new token.',
  },
  {
    step: 6,
    description: 'Give your token a descriptive name in the Note field.',
  },
  {
    step: 7,
    description: 'Under the Select scopes, check the following options:',
    substeps: [
      'repo (Full control of private repositories)',
      'repo:status (Access commit status)',
      'repo_deployment (Access deployment status)',
      'public_repo (Access public repositories)',
      'repo:invite (Access repository invitations)',
      'security_events (Read and write security events)',
      'admin:org (Full control of orgs and teams, read and write org projects)',
      'write:org (Read and write org and team membership, read and write org projects)',
      'read:org (Read org and team membership, read org projects)',
      'manage_runners:org (Manage org runners and runner groups)',
      'read:user',
    ],
  },
  {
    step: 8,
    description: 'Click on Generate token.',
  },
  {
    step: 9,
    description:
      'Copy the token to your clipboard. For security reasons, after you navigate off the page, you will not be able to see the token again.',
  },
];
