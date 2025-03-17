export const addAuthHeader = () => {
  // Get both tokens - the JWT token and the Firebase token
  const jwtToken = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
  const firebaseToken = typeof window !== 'undefined' ? localStorage.getItem('firebaseToken') : null;
  
  return {
    headers: {
      // Use the JWT token for general authorization
      'Authorization': jwtToken ? `Bearer ${jwtToken}` : '',
      'Content-Type': 'application/json',
      // Use the Firebase token specifically for the firebase_token header
      'firebase_token': firebaseToken || ''
    }
  };
};