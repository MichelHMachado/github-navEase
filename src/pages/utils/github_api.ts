import { Octokit } from 'octokit';

export async function fetchRepositories(apiKey: string) {
  if (!apiKey) {
    throw new Error('API key is undefined fetchRepositories');
  }
  const octokit = new Octokit({
    auth: apiKey,
  });
  try {
    const response = await octokit.request('GET /user/repos', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const userRepos = response.data.filter(repo => repo.owner.type === 'User');

    return userRepos;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function fetchOrgRepositories(apiKey: string) {
  if (!apiKey) {
    throw new Error('API key is undefined fetchOrgRepositories');
  }
  const octokit = new Octokit({
    auth: apiKey,
  });
  try {
    const orgs = await getAuthenticatedUserOrgs(apiKey);
    const orgReposPromises = orgs.map(async org => {
      const response = await octokit.request('GET /orgs/{org}/repos', {
        org: org,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      return response.data;
    });

    const orgRepos = await Promise.all(orgReposPromises);
    const mergedOrgRepos = orgRepos.flat();
    return mergedOrgRepos;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getAllRepos(apiKey: string) {
  if (!apiKey) {
    console.warn('API key is not available');
    return null;
  }
  try {
    const [userRepos, orgRepos] = await Promise.all([fetchRepositories(apiKey), fetchOrgRepositories(apiKey)]);
    const allRepos = [...userRepos, ...orgRepos];
    return allRepos;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getAuthenticatedUserOrgs(apiKey: string) {
  if (!apiKey) {
    throw new Error('API key is undefined getAuthenticatedUserOrgs');
  }
  const octokit = new Octokit({
    auth: apiKey,
  });
  try {
    const memberOrgsResponse = await octokit.request('GET /user/orgs', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const collabReposResponse = await octokit.request('GET /user/repos', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
      affiliation: 'collaborator',
    });

    const collabOrgs = collabReposResponse.data
      .filter(repo => repo.owner.type !== 'User')
      .map(repo => repo.owner.login);

    const memberOrgs = memberOrgsResponse.data.map(org => org.login);
    const allOrgs = [...new Set([...memberOrgs, ...collabOrgs])];
    return allOrgs;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getAuthenticatedUser(apiKey: string) {
  if (!apiKey) {
    throw new Error('API key is undefined getAuthenticatedUser');
  }
  const octokit = new Octokit({
    auth: apiKey,
  });
  try {
    const response = await octokit.request('GET /user', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
