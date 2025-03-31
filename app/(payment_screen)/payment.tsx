import React, { useState, useEffect } from 'react';
import { View, Button, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import RazorpayCheckout from '../../components/payments/Rzrpay';
import { router } from 'expo-router';
import supabase from '../../supabase';
import { useCart } from '../Context/CartContext';

const PaymentScreen = () => {
    const [showPayment, setShowPayment] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const { items, getTotalPrice, clearCart } = useCart();

    const amount = getTotalPrice() || 9000000000; // Fallback to 90 if cart is empty
    const rzrpayId = process.env.EXPO_PUBLIC_RZRPAY_KEY || '';
    const proj_ref = process.env.EXPO_PUBLIC_PROJ_REF;

    // Get user ID on component mount
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUserId(user?.id ?? null);
            } catch (error) {
                console.error('Error fetching user ID:', error);
                Alert.alert('Authentication Error', 'Please log in again.');
            }
        };

        fetchUserId();
    }, []);

    // Function to save cart items to database
    const saveCartToDatabase = async () => {
        if (!userId) {
            Alert.alert('Error', 'User not authenticated');
            return false;
        }

        if (items.length === 0) {
            Alert.alert('Error', 'Your cart is empty');
            return false;
        }

        // const { data, error } = await supabase
        //         .from("cartitems_dynamic")
        //         .insert(
        //             items.map((item) => ({
        //                 //customerid: userId,
        //                 itemid: item.item_id,
        //                 price: item.price,
        //                 quantity: item.quantity,
        //             }))
        //         );


        try {
            const { data, error } = await supabase.rpc('insert_order_with_items', {
                customer_id: userId,
                total_price: getTotalPrice() * 100, // Convert to paise
                status: 'pending',
                vendor_id: 1, // Example vendor ID
                created_by: userId,
                notes: 'Please deliver ASAP',
                pick_up_time: '2025-8-90',
                items: JSON.stringify([
                    ...items.map(item => ({ item_id: item.item_id, quantity: item.quantity, price: item.price })),
                ])
            });

            if (error) {
                console.error('Error:', error);
            } else {
                console.log('Order inserted successfully!');
            }

            console.log('Cart uploaded successfully:', data);
            return true;
        } catch (error) {
            console.error('Error uploading cart:', error);
            Alert.alert('Error', 'Failed to save your order');
            return false;
        }
    };

    // Function to create order on your backend
    const createOrder = async () => {
        setLoading(true);

        try {
            // Call your Supabase Edge Function to create an order
            const response = await fetch('https://mnhisdyeqfhcjqfesdjs.supabase.co/functions/v1/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${proj_ref}`,
                },
                body: JSON.stringify({
                    amount: amount * 100, // in paise
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
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

    const handlePaymentSuccess = async (data: { razorpay_payment_id: string; razorpay_signature: string }) => {
        // Save cart to database after simulated successful payment
        const saved = await saveCartToDatabase();
        if (saved) {
            clearCart(); // Clear cart after successful upload
            Alert.alert(
                'Success',
                `Payment simulated successfully! Payment ID: ${data.razorpay_payment_id}`,
                [{ text: 'OK', onPress: () => router.push('./OrderConfirmation') }]
            );
        }
    };




    const handlePaymentError = (error: any) => {
        console.error('Payment error:', error);
        Alert.alert(
            'Payment Failed',
            error.error?.description || error.description || 'Payment was cancelled'
        );
        setShowPayment(false);
    };


    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : !showPayment ? (
                <>
                    <Text style={styles.amountText}>Total Amount: ₹{amount}</Text>
                    <Button
                        title="Proceed to Payment"
                        onPress={createOrder}
                        disabled={items.length === 0}
                    />
                    {items.length === 0 && (
                        <Text style={styles.errorText}>Your cart is empty</Text>
                    )}
                </>
            ) : (
                <RazorpayCheckout
                    orderId={orderId}
                    amount={amount * 100} // Convert to paise
                    keyId={rzrpayId}
                    prefill={{
                        name: "Akshat",
                        email: "Akshat@example.com",
                        contact: "9999999999"
                    }}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                />
            )}

            <View style={styles.backButtonContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('./Cart')}
                >
                    <Text style={styles.backButtonText}>Back to Cart</Text>
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
    amountText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    backButtonContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: '#ff6f61',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default PaymentScreen;
