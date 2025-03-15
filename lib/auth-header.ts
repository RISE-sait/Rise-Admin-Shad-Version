export const addAuthHeader = () => {
    // Use window check for server-side rendering compatibility
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
    return {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      }
    };
  };