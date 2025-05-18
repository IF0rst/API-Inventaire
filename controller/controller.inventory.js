import {attemptEquip, attemptGrab, attemptUse, getInventoryData, getItemData} from "../services/service.inventory.js";

export const viewInventory = (req, res) => {
  try {
    const { userId } = req.user;
    const inventory = getInventoryData(userId);

    res.status(200).json({ error: false, data: inventory });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
};

export const viewItem = (req, res) => {
  try {
    const { id } = req.params;

    const item = getItemData(id);
    if (!item) {
      return res.status(404).json({ error: true, message: "Item not found" });
    }

    res.status(200).json({ error: false, data: item });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
};

export const equipItem = (req,res) => {
  try {
    const {itemId} = req.body;

    if (!itemId) {
      return res.status(404).json({error: true, message: "Enter a valid item id."});
    }

    const result = attemptEquip(req.user.userId,itemId)
    return res.status(200).json({ error: false, data: result });
  } catch (e){
  res.status(500).json({ error: true, message: e.message });
  }
}

export const useItem = (req,res) =>{
  try {
    const { userId } = req.user;
    const {itemId} = req.body;

    if (!itemId) {
      return res.status(404).json({error: true, message: "Enter a valid item id."});
    }

    res.status(200).json({ error: false, data: attemptUse(userId,itemId) });
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}

export const grabItem = (req,res) => {
    try {
    const {itemId} = req.body;

    if (!itemId) {
      return res.status(404).json({error: true, message: "Enter a valid item id."});
    }

    const result = attemptGrab(req.user.userId,itemId)
    return res.status(200).json({ error: false, data: result });
  } catch (e){
  res.status(500).json({ error: true, message: e.message });
  }
}