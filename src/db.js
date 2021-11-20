import * as uuid from 'uuid';
import levelup from 'levelup';
import memdown from 'memdown';

const db = levelup(memdown());

const createID = () => uuid.v1();

const getValue = async (name) => {
  try {
    return await db.get(name);
  } catch (e) {
    return null;
  }
};

const setValue = async (name, value) => {
  try {
    return await db.put(name, value, {});
  } catch (e) {
    return null;
  }
};

export default {
  createID, getValue, setValue,
};
