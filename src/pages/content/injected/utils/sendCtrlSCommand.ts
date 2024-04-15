export const sendCtrlSCommand = () => {
  document.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 's' }));
};
