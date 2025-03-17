"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CustomerService from "@/services/CustomerService";
import { CustomerRegistrationRequestDto } from "@/app/api/Api";

interface AddCustomerFormProps {
  onCustomerAdded?: () => void; // Rename from onSuccess to match expected prop
  onCancel?: () => void;
}

export default function AddCustomerForm({ 
  onCustomerAdded, 
  onCancel 
}: AddCustomerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CustomerRegistrationRequestDto>({
    first_name: "",
    last_name: "",
    age: 18,
    role: "athlete",
    phone_number: "", 
    country_code: "CA", // Use the country code format, not prefix
    has_consent_to_email_marketing: false,
    has_consent_to_sms: false,
  });

  const customerService = new CustomerService();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'age' ? parseInt(value) : value
      }));
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast.error("Please provide both first and last name.");
      return;
    }
  
    // Validate age
    if (formData.age <= 0 || formData.age > 120) {
      toast.error("Please provide a valid age between 1 and 120.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Create a copy of the form data to modify before sending
      const submissionData = { ...formData };
      
      // Format phone number with country code if provided
      if (submissionData.phone_number) {
        // Get the proper dialing code based on country code
        let dialingCode = '';
        switch(submissionData.country_code) {
          case 'US':
          case 'CA':
            dialingCode = '+1';
            break;
          case 'GB':
            dialingCode = '+44';
            break;
          case 'AU':
            dialingCode = '+61';
            break;
          default:
            dialingCode = '+1'; // Default
        }
        
        // Remove any non-digit characters from phone number
        const cleanPhone = submissionData.phone_number.replace(/\D/g, '');
        
        // Format phone number with dialing code
        submissionData.phone_number = `${dialingCode}${cleanPhone}`;
      }


      // Create a default waiver if required (adapt as needed for your use case)
      submissionData.waivers = [{
        is_waiver_signed: true,
        waiver_url: "https://example.com/default-waiver"
      }];
      
      console.log("Submitting customer data:", submissionData);
      await customerService.createCustomer(submissionData);
      toast.success("Customer successfully added!");
      
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        age: 18,
        role: "athlete",
        phone_number: "",
        country_code: "+1",
        has_consent_to_email_marketing: false,
        has_consent_to_sms: false,
      });
      
      // Notify parent component
      if (onCustomerAdded) {
        onCustomerAdded();
      }
    } catch (error: any) {
      console.error("Error adding customer:", error);
      toast.error(error.message || "Failed to add customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddCustomer} className="space-y-4 pt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Age</label>
        <Input
          type="number"
          value={String(formData.age)} // Convert to string to avoid NaN issues
          onChange={(e) => {
            const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
            setFormData({...formData, age: isNaN(value) ? 0 : value});
          }}
          min="1"
          max="120"
          required
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-1">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
          required
        >
          <option value="athlete">Athlete</option>
          <option value="parent">Parent</option>
        </select>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone Number
        </label>
        <div className="flex space-x-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="col-span-1">
              <label className="block text-sm font-medium mb-1">Country</label>
              <select
                value={formData.country_code}
                onChange={(e) => setFormData({...formData, country_code: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                {/* Add more country codes as needed */}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Phone Number (numbers only)</label>
              <Input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => {
                  // Remove any non-digit characters from input
                  const cleaned = e.target.value.replace(/\D/g, '');
                  setFormData({...formData, phone_number: cleaned});
                }}
                placeholder="5879731061"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="has_consent_to_email_marketing"
            checked={formData.has_consent_to_email_marketing}
            onChange={handleChange}
            className="rounded border-gray-300"
          />
          <span className="text-sm">Consent to Email Marketing</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="has_consent_to_sms"
            checked={formData.has_consent_to_sms}
            onChange={handleChange}
            className="rounded border-gray-300"
          />
          <span className="text-sm">Consent to SMS</span>
        </label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Adding..." : "Add Customer"}
      </Button>
    </form>
  );
}