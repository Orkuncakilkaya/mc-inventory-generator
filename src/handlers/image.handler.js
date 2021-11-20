import db from '../db';

export default async (req, res) => {
  const buffer = await db.getValue(`inventory-${req.query?.id}`);
  if (buffer === null || !buffer.length) {
    return res.status(404).send({ message: 'not found' });
  }

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': buffer.length,
  });
  return res.end(buffer);
};
