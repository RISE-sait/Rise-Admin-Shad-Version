import { Api } from './Api';
import getValue from '@/configs/constants';
import { addAuthHeader } from '@/lib/auth-header';

class ApiService {
  private api: Api<unknown>;

  constructor() {
    try {
      let baseUrl = getValue("API") || "http://localhost";

      // Remove trailing slash if it exists to prevent double slash
      baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      console.log('Initializing API Service with base URL:', baseUrl);
      this.api = new Api({
        baseUrl,
        securityWorker: addAuthHeader,
      });
    } catch (error) {
      console.error('Error initializing API Service:', error);
      throw error;
    }
  }

  get events() {
    if (!this.api) {
      throw new Error('API not initialized');
    }
    return this.api.events;
  }

  get eventStaff() {
    if (!this.api) {
      throw new Error('API not initialized');
    }
    return this.api.eventStaff;
  }

  get enrollments() {
    if (!this.api) {
      throw new Error('API not initialized');
    }
    return this.api.enrollments;
  }

  get locations() {
    if (!this.api) {
      throw new Error('API not initialized');
    }
    return this.api.locations;
  }

  get courses() {
    if (!this.api) {
      throw new Error('API not initialized');
    }
    return this.api.courses;
  }

  get practices() {
    if (!this.api) {
      throw new Error('API not initialized');
    }
    return this.api.practices;
  }

  get games() {
    if (!this.api) {
      throw new Error('API not initialized');
    }
    return this.api.games;
  }

  get staffs() {
    if (!this.api) {
      throw new Error('API not initialized');
    }
    return this.api.staffs;
  }
  get register() {
    if (!this.api) {
      throw new Error('API not initialized');
    }
    return this.api.register;
  }
}

export default ApiService;
const apiServiceInstance = new ApiService();
export { apiServiceInstance as ApiService };