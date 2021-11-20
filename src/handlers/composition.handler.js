import composite from '../composition';
import downloadImages from '../download';

export default async (req, res) => {
  const { items } = req.body;

  const itemIdList = items.reduce(
    (acc, item) => (
      acc.includes(item.id) ? acc : [...acc, item.id]
    ),
    [],
  );

  const incorrectItemIdList = await downloadImages(itemIdList);
  if (incorrectItemIdList.length > 0) {
    return res.status(400).json({
      message: 'Incorrect item id',
      code: 4,
      detail: incorrectItemIdList,
    });
  }

  const id = await composite(items);
  return res.json({ id });
};
