import database from "../db.js";

const DROPS = {
  zombieHand: {
    name: "Zombie Hand",
    damage: 4,
  },
  slimeStaff: {
    name: "Slime Staff",
    damage: 2,
  },
  batPotion: {
    name: "Bat Potion",
    healing: 50,
  },
};

const ENEMIES = [
  {
    name: "zombie",
    health: 10,
    drop: DROPS.zombieHand,
    damage: 10,
  },
  {
    name: "slime",
    health: 5,
    drop: DROPS.slimeStaff,
    damage: 2,
  },
  {
    name: "bat",
    health: 5,
    drop: DROPS.batPotion,
    damage: 1,
  },
];

export const getEnemiesList = () => {
  const stmt = database.prepare("SELECT id, name FROM enemy");
  const enemies = stmt.all();
  return { enemies };
};

export const createEnemy = () => {
  const randomEnemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];

  const insertItem = database.prepare(`
    INSERT INTO inventory (owner_id, itemJSON) VALUES (?, ?)
  `);
  const itemResult = insertItem.run(null, JSON.stringify(randomEnemy.drop));
  const dropItemId = itemResult.lastInsertRowid;

  const insertEnemy = database.prepare(`
    INSERT INTO enemy (name, health, dropItemId, damage) VALUES (?, ?, ?, ?)
  `);
  const enemyResult = insertEnemy.run(
    randomEnemy.name,
    randomEnemy.health,
    dropItemId,
    randomEnemy.damage
  );

  return {
    enemyId: enemyResult.lastInsertRowid,
    name: randomEnemy.name,
    health: randomEnemy.health,
    damage: randomEnemy.damage,
    drop: randomEnemy.drop,
  };
};

export const damageEnemy = (userId, enemyId) => {
  const userStmt = database.prepare(
    "SELECT equipped, health FROM user WHERE userId = ?"
  );
  const user = userStmt.get(userId);
  let damageToEnemy = 1;

  if (user && user.equipped !== null) {
    const weaponStmt = database.prepare(
      "SELECT itemJSON FROM inventory WHERE id = ?"
    );
    const weapon = weaponStmt.get(user.equipped);

    if (weapon) {
      const weaponData = JSON.parse(weapon.itemJSON);
      damageToEnemy =
        typeof weaponData.damage === "number" ? weaponData.damage : 1;
    }
  }

  const enemyStmt = database.prepare(
    "SELECT id, name, health, dropItemId, damage FROM enemy WHERE id = ?"
  );
  const enemy = enemyStmt.get(enemyId);

  if (!enemy) {
    return { error: `Enemy with id ${enemyId} does not exist.` };
  }

  const newEnemyHealth = Math.max(enemy.health - damageToEnemy, 0);
  const enemyIsDead = newEnemyHealth <= 0;

  if (enemyIsDead) {
    const deleteEnemyStmt = database.prepare(
      "DELETE FROM enemy WHERE id = ?"
    );
    deleteEnemyStmt.run(enemy.id);
  } else {
    const updateEnemyStmt = database.prepare(
      "UPDATE enemy SET health = ? WHERE id = ?"
    );
    updateEnemyStmt.run(newEnemyHealth, enemy.id);
  }

  const enemyDamage = enemy.damage || 1;
  const newUserHealth = Math.max(user.health - enemyDamage, 0);
  const updateUserStmt = database.prepare(
    "UPDATE user SET health = ? WHERE userId = ?"
  );
  updateUserStmt.run(newUserHealth, userId);

  const result = {
    userId,
    enemyId: enemy.id,
    enemyName: enemy.name,
    enemyHp: newEnemyHealth,
    playerHp: newUserHealth,
    damageDealtToEnemy: damageToEnemy,
    damageTakenByPlayer: enemyDamage,
    enemyDefeated: enemyIsDead,
  };

  if (enemyIsDead) {
    result.lootId = enemy.dropItemId;
  }

  return result;
};
