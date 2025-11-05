'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

// This is a Client Component because it uses useState and handles user events.


// Define the shape of our form data for TypeScript safety
interface FormData {
  first: string;
  last:string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  // 1. STATE: Use a single object to manage all form fields (Controlled Component)
  const [formData, setFormData] = useState<FormData>({
    first:'',
    last:'',
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // 2. HANDLER: Updates the state on every keystroke
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Use the input's 'name' attribute to update the corresponding key in the state object
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 3. SUBMISSION: Handles the form submission (the Side Effect)
  const handleSubmit = (e: FormEvent) => {

    
    e.preventDefault(); // MANDATORY: Prevents the default browser refresh

    setIsLoading(true);

    // In a real app, this is where you would call your Firebase/API function
    // For now, we just log the data to the console.
    console.log('[Form Submission] Data ready to send:', formData);

    // Simulate a network delay for visual feedback
    setTimeout(() => {
      setIsLoading(false);
      console.log('Registration simulated successfully.');
      // Clear the form after submission
      setFormData({
        first:'',
        last:'',
        email: '',
        password: '',
      });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
         {/* first name Input */}
      <div>
        <label htmlFor="first" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id="first"
          name="first"
          required
          value={formData.first}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
        />
      </div>


 {/* last name Input */}
      <div>
        <label htmlFor="last" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          id="last"
          name="last"
          required
          value={formData.last}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
        />
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
        />
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition duration-150"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Sign Up'
          )}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
