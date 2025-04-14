export const addAuthHeader = (token: string) => {
  
  return {
    headers: {
      // Use the JWT token for general authorization
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };
};