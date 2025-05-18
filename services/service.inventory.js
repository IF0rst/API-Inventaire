import database from "../db.js";

export const getInventoryData = (userId) => {
  const stmt = database.prepare(`
    SELECT id, itemJSON
    FROM inventory
    WHERE owner_id = ?
  `);

  const rows = stmt.all(userId);

  return rows.map(row => {
    const item = JSON.parse(row.itemJSON);
    return { ...item, id: row.id };
  });
};

export const getItemData = (itemId) => {
  const stmt = database.prepare("SELECT * FROM inventory WHERE id = ?");
  const item = stmt.get(itemId);

  if (!item) return null;

  const itemData = JSON.parse(item.itemJSON);
  return { id: item.id, owner_id: item.owner_id, ...itemData };
};

export const attemptEquip = (userId, itemId) => {
  const itemOwned = database.prepare(`
    SELECT itemJSON
    FROM inventory
    WHERE id = ? AND owner_id = ?
  `).get(itemId, userId);

  if (!itemOwned) {
    return { message: "not_owned" };
  }

  const itemData = JSON.parse(itemOwned.itemJSON);

  if (!("damage" in itemData)) {
    return { message: "not_weapon" };
  }

  const result = database.prepare(`
    UPDATE user SET equipped = ? WHERE userId = ?
  `).run(itemId, userId);

  if (result.changes === 0) {
    return {message: "user_not_found" };
  }

  return { equippedItemId: itemId };
};

export const attemptGrab = (userId, itemId) => {
  try {
    const stmt = database.prepare("SELECT * FROM inventory WHERE id = ?");
    const item = stmt.get(itemId);

    if (!item) {
      return { message: "not_found" };
    }

    if (!item.owner_id) {
      database.prepare("UPDATE inventory SET owner_id = ? WHERE id = ?").run(userId, itemId);
      return { grabbed: true, itemId };
    }

    return { grabbed: false, alreadyOwned: true };
  } catch {
    return { message: "unknown_error" };
  }
};

const useHealingItem = (userId, itemId, data) => {
  const user = database.prepare(`
    SELECT health, maxHealth FROM user WHERE userId = ?
  `).get(userId);

  if (!user) {
    return { message: "user_not_found" };
  }

  const healedAmount = Math.min(data.healing, user.maxHealth - user.health);
  const newHealth = Math.min(user.health + data.healing, user.maxHealth);

  database.prepare("UPDATE user SET health = ? WHERE userId = ?").run(newHealth, userId);
  database.prepare("DELETE FROM inventory WHERE id = ? AND owner_id = ?").run(itemId, userId);

  return {
    used: "healing",
    healedAmount,
    newHealth,
    maxHealth: user.maxHealth
  };
};

export const attemptUse = (userId, itemId) => {
  const item = database.prepare(`
    SELECT * FROM inventory
    WHERE id = ? AND owner_id = ?
  `).get(itemId, userId);

  if (!item) {
    return { message: "not_owned" };
  }

  const data = JSON.parse(item.itemJSON);

  if (data.healing) return useHealingItem(userId, itemId, data);

  return { message: "unusable_item" };
};
