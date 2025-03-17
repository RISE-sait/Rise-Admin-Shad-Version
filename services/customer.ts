import { 
    CustomerResponse, 
    CustomerChildRegistrationRequestDto,
    CustomerStatsUpdateRequestDto,
    CustomerAthleteResponseDto
  } from '@/app/api/Api';
  import { addAuthHeader } from '@/lib/auth-header';
  import getValue from '@/configs/constants';
  
  class CustomerApiService {
    private apiUrl: string;
  
    constructor() {
      this.apiUrl = getValue("API");
    }
  
    /**
     * Get all customers, optionally filtered by hubspot IDs
     */
    async getAllCustomers(hubspotIds?: string[]): Promise<CustomerResponse[]> {
      try {
        // Build query parameter for hubspot IDs if provided
        const queryParam = hubspotIds && hubspotIds.length > 0
          ? `?hubspot_ids=${hubspotIds.join(',')}`
          : '';
        
        const response = await fetch(`${this.apiUrl}customers${queryParam}`, {
          method: 'GET',
          ...addAuthHeader()
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }
    }
  
    // async createCustomer(customerData: CustomerRegistrationRequestDto): Promise<any> {
    //     try {
    //       // Determine which endpoint to use based on role
    //       let endpoint = '';
    //       let requestData: any = {};
          
    //       // Format the data according to the role-specific endpoint requirements
    //       if (customerData.role === 'athlete') {
    //         endpoint = '/register/athlete';
    //         requestData = {
    //           age: customerData.age,
    //           country_code: customerData.country_code,
    //           first_name: customerData.first_name,
    //           last_name: customerData.last_name,
    //           has_consent_to_email_marketing: customerData.has_consent_to_email_marketing,
    //           has_consent_to_sms: customerData.has_consent_to_sms,
    //           phone_number: customerData.phone_number,
    //           waivers: [{
    //             is_waiver_signed: true,
    //             waiver_url: "https://example.com/default-waiver"
    //           }]
    //         };
    //       } else if (customerData.role === 'parent') {
    //         endpoint = '/register/parent';
    //         requestData = {
    //           age: customerData.age,
    //           country_code: customerData.country_code,
    //           first_name: customerData.first_name,
    //           last_name: customerData.last_name,
    //           has_consent_to_email_marketing: customerData.has_consent_to_email_marketing,
    //           has_consent_to_sms: customerData.has_consent_to_sms,
    //           phone_number: customerData.phone_number
    //         };
    //       } else {
    //         throw new Error(`Unsupported customer role: ${customerData.role}`);
    //       }
          
    //       // Add detailed logging to help diagnose the issue
    //       console.log(`Creating ${customerData.role} using endpoint: ${this.apiUrl}${endpoint}`);
    //       console.log('Request data:', JSON.stringify(requestData, null, 2));
          
    //       // Get the Firebase token directly from localStorage
    //       const firebaseToken = typeof window !== 'undefined' ? localStorage.getItem('firebaseToken') : null;
          
    //       // Check if we have the token before proceeding
    //       if (!firebaseToken) {
    //         console.error('No Firebase token available. User may not be logged in.');
    //         throw new Error('Authentication required. Please log in again.');
    //       }
          
    //       // Create custom headers including the firebase_token header
    //       const headers = {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${firebaseToken}`,
    //         'firebase_token': firebaseToken
    //       };
          
    //       console.log('Using headers:', headers);
          
    //       const response = await fetch(`${this.apiUrl}${endpoint}`, {
    //         method: 'POST',
    //         headers,
    //         body: JSON.stringify(requestData)
    //       });
          
    //       // Get the full response text for more detailed error information
    //       const responseText = await response.text();
    //       console.log('Response status:', response.status);
    //       console.log('Response body:', responseText);
          
    //       if (!response.ok) {
    //         let errorMessage = `Failed to create customer: ${response.statusText}`;
            
    //         try {
    //           // Try to parse the response as JSON if possible
    //           const errorData = JSON.parse(responseText);
    //           if (errorData && errorData.error && errorData.error.message) {
    //             errorMessage = `Failed to create customer: ${errorData.error.message}`;
    //           } else if (errorData && errorData.message) {
    //             errorMessage = `Failed to create customer: ${errorData.message}`;
    //           } else if (errorData && errorData.error) {
    //             errorMessage = `Failed to create customer: ${JSON.stringify(errorData.error)}`;
    //           }
              
    //           console.error('Error data:', errorData);
    //         } catch (e) {
    //           // JSON parsing failed, use the raw response text
    //           console.error('Raw error response:', responseText);
    //         }
            
    //         throw new Error(errorMessage);
    //       }
      
    //       // If we got a valid JSON response, parse it and return
    //       try {
    //         return JSON.parse(responseText);
    //       } catch {
    //         // If parsing fails, just return the text
    //         return responseText;
    //       }
    //     } catch (error) {
    //       console.error('Error creating customer:', error);
    //       throw error;
    //     }
    //   }
    
    /**
     * Add a child customer
     */
    async createChildCustomer(childData: CustomerChildRegistrationRequestDto): Promise<any> {
      try {
        // Format data according to child endpoint requirements
        const requestData = {
          age: childData.age,
          first_name: childData.first_name,
          last_name: childData.last_name,
          waivers: childData.waivers || []
        };
        
        const response = await fetch(`${this.apiUrl}/register/child`, {
          method: 'POST',
          ...addAuthHeader(), // Let addAuthHeader provide the Content-Type
          body: JSON.stringify(requestData)
        });
  
        if (!response.ok) {
          let errorMessage = `Failed to create child customer: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (e) {
            // JSON parsing failed, use default error message
          }
          throw new Error(errorMessage);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error creating child customer:', error);
        throw error;
      }
    }
    
    /**
     * Get customer athlete statistics
     */
    async getCustomerStats(customerId: string): Promise<CustomerAthleteResponseDto> {
      try {
        const response = await fetch(`${this.apiUrl}/customers/${customerId}/athlete`, {
          method: 'GET',
          ...addAuthHeader()
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch customer stats: ${response.statusText}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error fetching customer stats:', error);
        throw error;
      }
    }
    
    /**
     * Update customer athlete statistics
     */
    async updateCustomerStats(
      customerId: string, 
      statsData: CustomerStatsUpdateRequestDto
    ): Promise<any> {
      try {
        const response = await fetch(`${this.apiUrl}/customers/${customerId}/athlete`, {
          method: 'PATCH',
          ...addAuthHeader(), // Let addAuthHeader provide the Content-Type
          body: JSON.stringify(statsData)
        });
  
        if (!response.ok) {
          throw new Error(`Failed to update customer stats: ${response.statusText}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error updating customer stats:', error);
        throw error;
      }
    }
    
    /**
     * Get membership plans for a customer
     */
    async getCustomerMembershipPlans(customerId: string): Promise<any> {
      try {
        const response = await fetch(`${this.apiUrl}/customers/${customerId}/membership-plans`, {
          method: 'GET',
          ...addAuthHeader()
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch customer membership plans: ${response.statusText}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error fetching customer membership plans:', error);
        throw error;
      }
    }
    
    /**
     * Test API connection
     */
    async testApiConnection(): Promise<boolean> {
      try {
        // Try to hit a simple endpoint that should always work if API is up
        const response = await fetch(`${this.apiUrl}/customers?limit=1`, {
          method: 'GET',
          ...addAuthHeader()
        });
        
        return response.ok;
      } catch (error) {
        console.error('API connection test failed:', error);
        return false;
      }
    }
  }
  
  export default CustomerApiService;