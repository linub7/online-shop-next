import nc from 'next-connect';
import Product from '../../../../models/Product';
import { isAuth, isAdmin } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'sample name',
    slug: `sample-name-${Math.random()}`,
    category: 'sample category',
    image: '/images/shirt1.jpg',
    price: 0,
    brand: 'sample brand',
    rating: 0,
    numReviews: 0,
    countInStock: 0,
    description: 'sample description',
  });
  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product Created', product });
});

export default handler;
