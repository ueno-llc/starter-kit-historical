const consoleError = console.error;
const consoleWarn = console.warn;

console.error = (first, ...args) => {
  const noRoutesChange = /You cannot change <Router routes>/;
  if (first && noRoutesChange.test(first)) return;
  consoleError.bind(console, first, ...args);
};

console.warn = (first, ...args) => {
  const noStoreChange = /Provided store (.*) has changed/;
  if (first && noStoreChange.test(first)) return;
  consoleWarn.bind(console, first, ...args);
};
