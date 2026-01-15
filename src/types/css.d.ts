// Type declarations for CSS module imports
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Specific declaration for driver.js CSS
declare module 'driver.js/dist/driver.css';
