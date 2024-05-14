import('@pages/content/injected/utils').then(async ({ getAllRepos, getAuthenticatedUser, sendMessage }) => {
  let apiKey: string | undefined;

  chrome.runtime.onMessage.addListener(async message => {
    console.log('All messagens on content: ', message);
    if (message.type === 'REQUEST_REPOSITORIES_DATA' && !message.dataReceived) {
      console.log('REQUEST_REPOSITORIES_DATA: ', message);
      /* const result = await new Promise<{ apiKey?: string }>((resolve, reject) => {
        chrome.storage.local.get('apiKey', data => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(data);
          }
        });
      }); */

      apiKey = message.apiKey;

      const repositoriesData = await getAllRepos(apiKey);
      const user = await getAuthenticatedUser(apiKey);
      const userId = user.id;
      sendMessage('REPOSITORIES_DATA', { data: repositoriesData, userId, dataReceived: message.dataReceived });
    }
  });
});
