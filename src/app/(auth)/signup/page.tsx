import React from 'react';
import SignupForm from '../../components/SignupForm';


const SignupPage = () => {
  return (
    <div className="py-16">
      <div className="max-w-md mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Register Your Account
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Access the full menu management system.
        </p>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
