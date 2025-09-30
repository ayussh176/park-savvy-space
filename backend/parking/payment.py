"""
payment.py

This module handles payment integrations using Razorpay, supporting multiple payment methods:
- UPI
- QR Code
- Netbanking
- Card Payments

Documentation: https://razorpay.com/docs/payment-gateway/server-integration/python/
"""

import razorpay
from django.conf import settings

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def create_order(amount, currency="INR", payment_method=None):
    """
    Create an order in Razorpay.

    Args:
        amount (int): Amount in paise (100 INR = 10000)
        currency (str): Currency code (default INR)
        payment_method (str): Preferred payment method, options are:
            'upi', 'qr', 'netbanking', 'card'
    
    Returns:
        dict: Razorpay order details
    """
    order_data = {
        "amount": amount,
        "currency": currency,
        "payment_capture": 1,  # Auto-capture
    }
    # Optional: restrict to specific payment methods
    if payment_method:
        order_data["method"] = payment_method

    return razorpay_client.order.create(order_data)

def verify_payment(payment_id, order_id, signature):
    """
    Verify the payment signature returned by Razorpay after payment.

    Args:
        payment_id (str)
        order_id (str)
        signature (str)
    
    Returns:
        bool: True if verification succeeds, else False
    """
    params_dict = {
        "razorpay_payment_id": payment_id,
        "razorpay_order_id": order_id,
        "razorpay_signature": signature,
    }
    try:
        razorpay_client.utility.verify_payment_signature(params_dict)
        return True
    except razorpay.errors.SignatureVerificationError:
        return False

# Example usage for different payment methods:
# order = create_order(10000, payment_method='upi')          # UPI
# order = create_order(10000, payment_method='card')         # Card
# order = create_order(10000, payment_method='netbanking')   # Netbanking
# order = create_order(10000, payment_method='qr')           # QR Code

# NOTE: Frontend integration (JS) is needed to display specific payment options to users.
