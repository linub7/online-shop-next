import nc from 'next-connect';
import { onError } from '../../../../utils/error';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nc({ onError });
handler.use(isAuth);
handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    res.send({ message: 'order Paid', order: paidOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Order not Found' });
  }
});

export default handler;
