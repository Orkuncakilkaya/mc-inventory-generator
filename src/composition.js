import Jimp from 'jimp';
import getOffsetFromIndex from './grid';
import db from './db';
import { negativeFont, positiveFont } from './fonts';

const tileBg = await Jimp.read('./assets/tile_bg.png');

async function composite(items) {
  const image = await Jimp.read('./assets/chest.png');
  /* eslint-disable no-await-in-loop */
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const { top, left } = getOffsetFromIndex(index);
    const tile = await Jimp.read(await db.getValue(`item-${item.id}`));
    await image.composite(tile, left, top);
    await image.composite(tileBg, left, top);
    await image.print(
      item.stack >= 0 ? positiveFont : negativeFont,
      left,
      top + 46,
      Math.abs(item.stack),
    );
  }
  /* eslint-enable no-await-in-loop */

  return new Promise((resolve, reject) => {
    image.getBuffer(Jimp.MIME_PNG, async (err, buffer) => {
      if (err) {
        return reject(err);
      }

      const id = db.createID();
      await db.setValue(`inventory-${id}`, buffer);

      return resolve(id);
    });
  });
}

export default composite;
