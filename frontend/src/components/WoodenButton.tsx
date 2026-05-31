
/* create WoodenButton component */
export const WoodenButton = ({ children }) => (
  <button className='bg-wood-medium border-b-4 border-wood-dark px-4 py-2 rounded text-paper active:border-b-0 active:translate-y-1 transition-all'>
    {children}
  </button>
);
