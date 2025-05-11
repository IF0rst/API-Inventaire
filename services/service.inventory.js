import database from "../db.js";

export const getInventoryData = (userId) => {
    const stmt = database.prepare(`
        SELECT id, itemJSON
        FROM inventory
        WHERE owner_id = ?
    `);

    const rows = stmt.all(userId);

    const items = rows.map(row => {
        const item = JSON.parse(row.itemJSON);
        return {
            ...item, id: row.id
        };
    });

    return items;
};

export const getItemData = (itemId) => {
  const stmt = database.prepare("SELECT * FROM inventory WHERE id = ?");
  const item = stmt.get(itemId);

  if (!item) {
    return null;
  }

  const itemData = JSON.parse(item.itemJSON);

  return {
    id: item.id,
    owner_id: item.owner_id,
    ...itemData
  };
};

export const attemptEquip = (userId, itemId) => {
  const checkOwnership = `
    SELECT 1 FROM inventory
    WHERE id = ? AND owner_id = ?
  `;

  const itemOwned = database.prepare(checkOwnership).get(itemId, userId);

  if (!itemOwned) {
    throw new Error(`Item with ID ${itemId} does not belong to user ${userId}.`);
  }

  const equipItem = `
    UPDATE user
    SET equipped = ?
    WHERE userId = ?
  `;

  const result = database.prepare(equipItem).run(itemId, userId);

  if (result.changes === 0) {
    throw new Error(`Failed to equip item for user ${userId} (user not found?).`);
  }

  return `User ${userId} equipped item with ID ${itemId}.`;
};

export const attemptGrab = (userId, itemId) => {
  try {
    const stmt = database.prepare("SELECT * FROM inventory WHERE id = ?");
    const item = stmt.get(itemId);

    if (!item) {
      throw new Error("Item not found");
    }

    if (!item.owner_id) {
      const updateStmt = database.prepare("UPDATE inventory SET owner_id = ? WHERE id = ?");
      updateStmt.run(userId, itemId);
      return { message: "Item successfully added to your inventory." };
    } else {
      return { message: "Item already owned." };
    }

  } catch (err) {
    return { message: "Failed to grab item" };
  }
};
