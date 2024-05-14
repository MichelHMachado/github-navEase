import('@root/src/pages/utils').then(async ({ getAllRepos, getAuthenticatedUser, sendMessage }) => {
  let accessToken: string | undefined;

  chrome.runtime.onMessage.addListener(async message => {
    if (message.type === 'REQUEST_REPOSITORIES_DATA' && !message.dataReceived) {
      console.log('Received request of data on content: ', message);

      accessToken = message.accessToken;

      const repositoriesData = await getAllRepos(accessToken);
      const user = await getAuthenticatedUser(accessToken);
      const userId = user.id;
      sendMessage('REPOSITORIES_DATA', { data: repositoriesData, userId, dataReceived: message.dataReceived });
    }
  });
});
