import fetch from 'node-fetch';
import db from './db';

const itemBasePath = 'https://minecraftitemids.com/item/64/item-name.png';

const download = async (itemName) => {
  if (await db.getValue(`item-${itemName}`)) {
    return true;
  }

  try {
    const response = await fetch(itemBasePath.replace('item-name', itemName));
    if (response.status !== 200) {
      return false;
    }
    const buffer = await response.buffer();
    await db.setValue(`item-${itemName}`, buffer);
    return true;
  } catch (e) {
    return false;
  }
};

async function downloadImages(itemIdList) {
  let error = [];
  /* eslint-disable no-await-in-loop */
  for (let index = 0; index < itemIdList.length; index += 1) {
    const itemId = itemIdList[index];
    if (!(await download(itemId))) {
      error = [...error, itemId];
    }
  }
  /* eslint-enable no-await-in-loop */

  return error;
}

export default downloadImages;
