const { MercadoPagoConfig, Preference } = require('mercadopago');
const Order = require('../models/Order');

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const createOrder = async (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Carrinho vazio' });
  }

  try {
    const order = await Order.create({
      user: req.user._id,
      items: items.map(i => ({
        product: i._id,
        name:     i.name,
        price:    i.price,
        quantity: i.quantity,
        image:    i.image || '',
      })),
      total,
      status: 'pendente',
    });

    const mpItems = items.map(i => ({
      id:          i._id,
      title:       i.name,
      quantity:    Number(i.quantity),
      unit_price:  parseFloat(i.price),
      currency_id: 'BRL',
    }));

    const preference = new Preference(mp);
    const mpResponse = await preference.create({
      body: {
        items: mpItems,
        payer: { email: req.user.email },
        external_reference: order._id.toString(),
        back_urls: {
          success: 'http://localhost:5173/checkout/success',
          failure: 'http://localhost:5173/checkout/failure',
          pending: 'http://localhost:5173/checkout/pending',
        },
      },
    });

    res.json({
      orderId:     order._id,
      checkoutUrl: mpResponse.sandbox_init_point,
    });

  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ message: err?.message || JSON.stringify(err) });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar pedidos' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar pedidos' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar pedido' });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };