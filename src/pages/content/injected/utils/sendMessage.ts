export const sendMessage = (type: string, obj?: object) => {
  chrome.runtime.sendMessage({ type, ...obj });
};
