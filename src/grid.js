let grid = [];

for (let y = 0; y < 6; y += 1) {
  for (let x = 0; x < 9; x += 1) {
    grid = [...grid, { x, y }];
  }
}

const getOffsetFromIndex = (index) => {
  const tile = grid[index];

  const startX = 28;
  const startY = 66;
  const cellWidth = 72;
  const cellHeight = 72;
  const itemWidth = 64;
  const itemHeight = 64;
  const itemOffsetWidth = (cellWidth - itemWidth) / 2;
  const itemOffsetHeight = (cellHeight - itemHeight) / 2;

  return {
    left: startX + (cellWidth * tile.x) + itemOffsetWidth,
    top: startY + (cellHeight * tile.y) + itemOffsetHeight,
  };
};

export default getOffsetFromIndex;
