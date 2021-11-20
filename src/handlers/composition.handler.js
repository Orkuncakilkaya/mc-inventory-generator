import composite from '../composition';

export default async (req, res) => {
  const { items } = req.body;
  const id = await composite(items);
  res.json({ id });
};
