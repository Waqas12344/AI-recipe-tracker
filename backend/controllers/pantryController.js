import PantryItem from "../models/PantryItem.js";

// Get all pantry items

export const getPantryItems = async (req, res, next) => {
  try {
    const { category, is_running_low, search } = req.query;

    const items = await PantryItem.findByUserId(req.user.id, {
      category,
      is_running_low:
        is_running_low === "true"
          ? true
          : is_running_low === "false"
            ? false
            : undefined,
      search,
    });

    res.json({
      success: true,
      data: { items },
    });
  } catch (err) {
    next(err);
  }
};

// Get pantry stats

export const getPantryStats = async (req, res, next) => {
  try {
    const stats = await PantryItem.getStats(req.user.id);
    res.json({
      success: true,
      data: { stats },
    });
  } catch (err) {
    next(err);
  }
};

// Get items expiring soon

export const getExpiringSoon = async (req, res, next) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 7;
    const items = await PantryItem.getExpiringSoon(req.user.id, days);
    res.json({
      success: true,
      data: { items },
    });
  } catch (err) {
    next(err);
  }
};

// Add pantry item

export const addPantryItem = async (req, res, next) => {
  try {
    const item = await PantryItem.create(req.user.id, req.body);
    res.json({
      success: true,
      data: { item },
    });
  } catch (err) {
    next(err);
  }
};

// update pantry item
export const updatePantryItem = async (req, res, next) => {
  try {
    const item = await PantryItem.update(req.params.id, req.user.id, req.body);
    res.json({
      success: true,
      data: { item },
    });
  } catch (err) {
    next(err);
  }
};

// Delete pantry item
export const deletePantryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await PantryItem.delete(id, req.user.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Pantry item not found",
      });
    }
    res.json({
      success: true,
      message: "Pantry item deleted successfully",
      data: { item },
    });
  } catch (err) {
    next(err);
  }
};


