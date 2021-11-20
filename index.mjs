import express from 'express';
import joi from 'joi';
import * as fs from "fs";
import fetch from "node-fetch";
import Jimp from 'jimp';

const app = express();
const itemBasePath = "https://minecraftitemids.com/item/64/item-name.png";

const positiveFont = await Jimp.loadFont('./assets/fonts/positive.fnt');
const negativeFont = await Jimp.loadFont('./assets/fonts/negative.fnt');
const tileBg = await Jimp.read('./assets/tile_bg.png');

let grid = [];

for(let y = 0; y<6;y++) {
    for(let x = 0; x<9; x++) {
        grid = [...grid, {x, y}];
    }
}

const itemValidator = joi.object().keys({
    id: joi.string().required(),
    stack: joi.number().required(),
});

const inventoryValidator = joi.array().items(itemValidator);

const download = async (itemName) => {
    if(fs.existsSync(`./assets/items/${itemName}.png`)) {
        return true;
    }

    try {
        const response = await fetch(itemBasePath.replace('item-name', itemName));
        if(response.status !== 200) {
           return false;
        }
        const buffer = await response.buffer();
        fs.writeFileSync(`./assets/items/${itemName}.png`, buffer);
        return true;
    } catch (_) {
        return false;
    }
};

const downloadImages = async (itemIdList) => {
    let error = [];
    for(const itemId of itemIdList) {
        if(!await download(itemId)) {
            error = [...error, itemId];
        }
    }

    return error;
};

const getOffsetFromIndex = (index) => {
    const tile = grid[index];

    const startX = 28;
    const startY = 66;
    const cellWidth = 72;
    const cellHeight = 72;
    const itemWidth = 64;
    const itemHeight = 64;
    const itemOffsetWidth = (cellWidth - itemWidth) / 2
    const itemOffsetHeight = (cellHeight - itemHeight) / 2;

    return {
        left: startX + (cellWidth * tile.x) + itemOffsetWidth,
        top: startY + (cellHeight * tile.y) + itemOffsetHeight,
    }
};

app.get('/inventory.png', async (req, res) => {
    if(!req.query.items) {
        return res.status(422).json({message: 'You must send a valid array to items query parameter', code: 1});
    }

    let items = [];

    try {
        items = JSON.parse(req.query?.items)
    } catch (e) {
        return res.status(422).json({message: 'Couldn\'t parse items in query param', code: 5});
    }

    if(!Array.isArray(items)) {
        return res.status(422).json({message: 'Couldn\'t parse items in query param', code: 2});
    }

    if(items.length > 54) {
        return res.status(422).json({message: 'You can\'t send more than 54 items', code: 6});
    }

    const validate = inventoryValidator.validate(items);
    if(validate.error) {
        return res.status(422).json({message: 'Format is invalid', code: 3, detail: validate.error});
    }

    const itemIdList = items.reduce((acc, item) => {
        return acc.includes(item.id) ? acc : [...acc, item.id];
    }, []);

    const incorrectItemIdList = await downloadImages(itemIdList);
    if(incorrectItemIdList.length > 0) {
        return res.status(400).json({
            message: 'Incorrect item id',
            code: 4,
            detail: incorrectItemIdList
        });
    }

    const image = await Jimp.read('./assets/chest.png');
    for(const index in items) {
        const item = items[index];
        const {top, left} = getOffsetFromIndex(index);
        const tile = await Jimp.read(`./assets/items/${item.id}.png`);
        await image.composite(tile, left, top);
        await image.composite(tileBg, left, top);
        await image.print(item.stack >= 0 ? positiveFont : negativeFont, left, top+40, Math.abs(item.stack));
    }

    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if(err) {
            throw err;
        }

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length
        });
        res.end(buffer);
    });
})

app.listen(process.env.PORT);