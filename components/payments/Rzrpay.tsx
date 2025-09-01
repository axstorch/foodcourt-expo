import React, { useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

interface RazorpayProps {
  orderId: string;
  amount: number;
  keyId: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  onPaymentSuccess: (data: any) => void;
  onPaymentError: (error: any) => void;
}

const RazorpayCheckout: React.FC<RazorpayProps> = ({
  orderId,
  amount,
  keyId,
  prefill,
  onPaymentSuccess,
  onPaymentError
}) => {
  const webViewRef = useRef<WebView>(null);

  // Fallback to environment variable if keyId prop is not provided
  const razorpayKey = keyId || process.env.EXPO_PUBLIC_RZRPAY_KEY as string;

  // Ensure amount is a number and convert to paise (Razorpay uses paise)
  const amountInPaise = Math.round(Number(amount));

  // Validate required props
  useEffect(() => {
    if (!orderId) {
      console.error('Razorpay Checkout: orderId is required');
      onPaymentError({ error: { description: 'Missing order ID' } });
    }

    if (!razorpayKey) {
      console.error('Razorpay Checkout: keyId is required');
      onPaymentError({ error: { description: 'Missing Razorpay API key' } });
    }

    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      console.error('Razorpay Checkout: amount must be a positive number');
      onPaymentError({ error: { description: 'Invalid amount' } });
    }
  }, [orderId, razorpayKey, amountInPaise]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Razorpay Payment</title>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        #rzp-button {
          padding: 12px 24px;
          background-color: #3399cc;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #rzp-button:hover {
          background-color: #2980b9;
        }
        #loading {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div id="loading">Initializing payment gateway...</div>
      <button id="rzp-button" style="display: none;">Pay ₹${(amountInPaise).toFixed(2)}</button>
      
      <script>
        // Function to initialize Razorpay
        function initRazorpay() {
          document.getElementById('loading').style.display = 'none';
          document.getElementById('rzp-button').style.display = 'block';
          
          var options = {
            key: "${razorpayKey}",
            amount: "${amountInPaise}", 
            currency: "INR",
            name: "Crave",
            description: "Food Order Payment",
            image: "https://your-app-logo.png",
            order_id: "${orderId}",
            handler: function (response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'success',
                data: response
              }));
            },
            prefill: {
              name: "${prefill?.name || ''}",
              email: "${prefill?.email || ''}",
              contact: "${prefill?.contact || ''}"
            },
            notes: {
              address: "Customer Address"
            },
            theme: {
              color: "#3399cc"
            },
            modal: {
              ondismiss: function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'dismissed'
                }));
              }
            }
          };
          
          var rzp = new Razorpay(options);
          rzp.on('payment.failed', function (response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              data: response
            }));
          });
          
          document.getElementById('rzp-button').onclick = function() {
            rzp.open();
          };
          
          // Auto-open after a short delay to ensure everything is loaded
          setTimeout(function() {
            rzp.open();
          }, 500);
        }
        
        // Initialize after a short delay to ensure WebView is fully loaded
        setTimeout(initRazorpay, 1000);
        
        // Handle errors
        window.onerror = function(message, source, lineno, colno, error) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            data: { error: { description: message } }
          }));
          return true;
        };
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'success') {
        onPaymentSuccess(data.data);
      } else if (data.type === 'error') {
        onPaymentError(data.data);
      } else if (data.type === 'dismissed') {
        onPaymentError({ error: { description: 'Payment cancelled by user' } });
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
      onPaymentError({
        error: {
          description: 'Failed to process payment response'
        }
      });
    }
  };

  const renderLoading = () => {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3399cc" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={renderLoading}
        style={styles.webview}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          onPaymentError({
            error: {
              description: `WebView error: ${nativeEvent.description}`
            }
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  }
});

export default RazorpayCheckout;
