import React, { useState } from 'react';
import { View, Button, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import RazorpayCheckout from '../../components/payments/Rzrpay';
import { useRouter, Stack, router } from 'expo-router';

const PaymentScreen = () => {
    const [showPayment, setShowPayment] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);

    console.log("I am on");

    const amount = 90; // 
    const rzrpayId = process.env.EXPO_PUBLIC_RZRPAY_KEY as string;
    const proj_ref = process.env.EXPO_PUBLIC_PROJ_REF as string;

    // Function to create order on your backend
    const createOrder = async () => {
        try {
            setLoading(true);
            // Call your Supabase Edge Function to create an order
            const response = await fetch('https://mnhisdyeqfhcjqfesdjs.supabase.co/functions/v1/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${proj_ref}`,
                },
                body: JSON.stringify({
                    amount: amount, // in paise
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                    // Include foodCourtId if needed for routing payments
                    foodCourtId: 'foodcourt1'
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();

            if (data.id) {
                setOrderId(data.id);
                setShowPayment(true);
            } else {
                Alert.alert('Error', 'Failed to create order: No order ID received');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (data: any) => {
        // Verify payment on backend before confirming success to user
        verifyPayment({
            orderId: orderId,
            paymentId: data.razorpay_payment_id,
            signature: data.razorpay_signature
        });
    };

    const handlePaymentError = (error: any) => {
        console.error('Payment error:', error);
        Alert.alert(
            'Payment Failed',
            error.error?.description || error.description || 'Payment was cancelled'
        );
        setShowPayment(false);
    };

    const verifyPayment = async (paymentData: {
        orderId: string;
        paymentId: string;
        signature: string;
    }) => {
        try {
            setLoading(true);
            // Call your backend to verify payment
            const response = await fetch('https://mnhisdyeqfhcjqfesdjs.supabase.co/functions/v1/verifyPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (!response.ok) {
                throw new Error(`Verification failed with status: ${response.status}`);
            }

            const data = await response.json();

            if (data.verified) {
                Alert.alert('Success', `Payment verified successfully! ID: ${paymentData.paymentId}`);
                // Handle successful payment (update UI, navigate to success screen, etc.)
            } else {
                Alert.alert('Warning', 'Payment received but verification failed. Please contact support.');
            }
        } catch (error) {
            console.error('Verification error:', error);
            Alert.alert(
                'Verification Error',
                'We received your payment, but had trouble verifying it. Please contact support with your payment ID.'
            );
        } finally {
            setLoading(false);
            setShowPayment(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : !showPayment ? (
                <Button title="Proceed to Payment" onPress={createOrder} />
            ) : (
                <RazorpayCheckout
                    orderId={orderId}
                    amount={amount * 100} // Convert to paise
                    keyId={rzrpayId} // Use the actual variable, not the string "rzrpayId"
                    prefill={{
                        name: "Akshat",
                        email: "Akshat@example.com",
                        contact: "9999999999"
                    }}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                />

            )}
            <View style={styles.backbutton}>
                <TouchableOpacity onPress={() => router.push('./Cart')}>
                    <Text style={styles.backbuttontext}>Take me Back!</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },

    backbutton: {
        justifyContent: 'center',
        paddingTop: 20,
        alignItems: 'center',
        backgroundColor: '#ff6f61',
        textAlign: 'center',
    },

    backbuttontext: {
        color: 'white',
        fontWeight: 'bold',

    }
});

export default PaymentScreen;
