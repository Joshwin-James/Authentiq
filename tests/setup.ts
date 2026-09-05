import '@testing-library/jest-dom';

// jsdom doesn't implement window.alert — mock it so tests don't throw
window.alert = () => {};
