import('@pages/content/injected/utils').then(async ({ getAllRepos, getAuthenticatedUser, sendMessage }) => {
  let apiKey: string | undefined;

  chrome.runtime.onMessage.addListener(async message => {
    if (message.type === 'REQUEST_REPOSITORIES_DATA' && !message.dataReceived) {
      const result = await new Promise<{ apiKey?: string }>((resolve, reject) => {
        chrome.storage.local.get('apiKey', data => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(data);
          }
        });
      });

      apiKey = result.apiKey;

      const repositoriesData = await getAllRepos(apiKey);
      const user = await getAuthenticatedUser(apiKey);
      const userId = user.id;
      sendMessage('REPOSITORIES_DATA', { data: repositoriesData, userId, dataReceived: message.dataReceived });
    }
  });
});
