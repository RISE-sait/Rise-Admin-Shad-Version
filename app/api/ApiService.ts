import { Api } from './Api';
import getValue from '@/configs/constants';

class ApiService {
  private api: Api<unknown>;

  constructor() {
    try {
      const baseUrl = getValue("API") || 'http://localhost:80';
      console.log('Initializing API Service with base URL:', baseUrl);
      this.api = new Api({ baseUrl });
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
}

export default ApiService;