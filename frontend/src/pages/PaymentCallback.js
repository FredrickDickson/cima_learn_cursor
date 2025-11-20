import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      
      if (!reference) {
        setStatus('error');
        setMessage('No payment reference found. Please try again.');
        setTimeout(() => navigate('/courses'), 3000);
        return;
      }

      try {
        const response = await axios.post(`${config.API_URL}/api/payments/verify`, {
          reference: reference
        });

        if (response.data.success) {
          setStatus('success');
          setMessage('Payment successful! You are now enrolled in the course.');
          setTimeout(() => navigate('/my-courses'), 2000);
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Payment verification failed.');
          setTimeout(() => navigate('/courses'), 3000);
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setStatus('error');
        setMessage(err.response?.data?.message || 'Payment verification failed. Please contact support.');
        setTimeout(() => navigate('/courses'), 3000);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === 'processing' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-green-600">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to your courses...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-600">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/courses')}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition"
            >
              Go to Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;

