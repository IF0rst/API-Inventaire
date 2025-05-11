import database from "../db.js";

const DROPS = {
  zombieHand : {
    name: "Zombie Hand",
    damage : 4,
  },
  slimeStaff : {
    name: "Slime Staff",
    damage : 2,
  }
}

const ENEMIES = [
  {
    name : "zombie",
    health : 10,
    drop : DROPS.zombieHand
  },
  {
    name : "slime",
    health : 5,
    drop : DROPS.slimeStaff
  }
]

export const getEnemiesList = () => {
  const stmt = database.prepare("SELECT id, name FROM enemy");
  const enemies = stmt.all();
  return enemies;
};

export const createEnemy = () => {
  const randomEnemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];

  const insertItem = database.prepare(`
    INSERT INTO inventory (owner_id, itemJSON) VALUES (?, ?)
  `);
  const itemResult = insertItem.run(null, JSON.stringify(randomEnemy.drop));
  const dropItemId = itemResult.lastInsertRowid;

  const insertEnemy = database.prepare(`
    INSERT INTO enemy (name, health, dropItemId) VALUES (?, ?, ?)
  `);

  const enemyResult = insertEnemy.run(randomEnemy.name, randomEnemy.health, dropItemId);
  return enemyResult.lastInsertRowid;
};

export const damageEnemy = (userId, enemyId) => {
  const userStmt = database.prepare("SELECT equipped FROM user WHERE userId = ?");
  const user = userStmt.get(userId);
  let damage = 1;

  if (user && user.equipped !== null) {
    const weaponStmt = database.prepare("SELECT itemJSON FROM inventory WHERE id = ?");
    const weapon = weaponStmt.get(user.equipped);

    if (weapon) {
      const weaponData = JSON.parse(weapon.itemJSON);
      damage = typeof weaponData.damage === "number" ? weaponData.damage : 1;
    }
  }

  const enemyStmt = database.prepare("SELECT id, name, health, dropItemId FROM enemy WHERE id = ?");
  const enemy = enemyStmt.get(enemyId);

  if (!enemy) {
    return `Enemy with id ${enemyId} does not exist.`;
  }

  const newHealth = enemy.health - damage;

  if (newHealth > 0) {
    const updateStmt = database.prepare("UPDATE enemy SET health = ? WHERE id = ?");
    updateStmt.run(newHealth, enemy.id);
    return `${enemy.name} has ${newHealth} HP remaining.`;
  } else {
    const deleteStmt = database.prepare("DELETE FROM enemy WHERE id = ?");
    deleteStmt.run(enemy.id);
    return `${enemy.name} has died, the loot id is ${enemy.dropItemId}.`;
  }
};
