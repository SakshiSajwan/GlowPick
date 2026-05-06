const { sendEmail }                  = require('../utils/emailService');
const { orderConfirmationTemplate }  = require('../utils/emailTemplates');
const Order                          = require('../models/Order');
const User                           = require('../models/User');


console.log('✅ orderController.js loaded');
const addOrderItems = async (req, res) => {
    console.log('🔥 addOrderItems called');
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
        orderItems,
        user:            req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);

    // Send email in background after response
    setImmediate(async () => {
        try {
            console.log('📧 Order email — looking up user...');
            const emailUser = await User.findById(req.user._id).select('name email');
            console.log('📧 User found:', emailUser?.email);

            if (!emailUser?.email) {
                console.log('⚠️ No email found for user, skipping.');
                return;
            }

            const orderForEmail = {
                _id:             createdOrder._id,
                orderItems:      orderItems.map(item => ({
                    name:  item.name,
                    qty:   item.qty,
                    image: item.image,
                    price: item.price,
                })),
                shippingAddress: createdOrder.shippingAddress,
                paymentMethod:   createdOrder.paymentMethod,
                itemsPrice:      createdOrder.itemsPrice,
                taxPrice:        createdOrder.taxPrice,
                shippingPrice:   createdOrder.shippingPrice,
                totalPrice:      createdOrder.totalPrice,
                createdAt:       createdOrder.createdAt,
            };

            console.log('📧 Calling sendEmail...');
            await sendEmail(
                emailUser.email,
                `🌸 Order Confirmed #${createdOrder._id.toString().slice(-8).toUpperCase()} — GlowPick`,
                orderConfirmationTemplate(emailUser.name, orderForEmail)
            );
            console.log('✅ Order confirmation email sent to:', emailUser.email);

        } catch (err) {
            console.error('❌ Order email error:', err.message);
            console.error(err.stack);
        }
    });
};

const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid        = true;
        order.paidAt        = Date.now();
        order.paymentResult = {
            id:            req.body.id,
            status:        req.body.status,
            update_time:   req.body.update_time,
            email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
};