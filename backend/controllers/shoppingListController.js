import PantryItem from '../models/PantryItem.js';
import ShoppingList from '../models/ShoppingList.js';

// Generate shopping list from meal plan 

export const generateFromMealPlan = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "startDate and endDate query parameters are required",
            });
        }

        const items = await ShoppingList.generateFromMealPlan(req.user.id, startDate, endDate);

        res.json({
            success: true,
            message: "Shopping list generated from meal plan",
            data: { items }
        });
    } catch (err) {
        next(err);
    }
};

// Get shopping list items 

export const getShoppingList = async (req, res, next) => {
    try {
        const grouped = req.query.grouped === 'true';

        const items = grouped
            ? await ShoppingList.getGroupedByCategory(req.user.id)
            : await ShoppingList.findByUserId(req.user.id);

        res.json({
            success: true,
            data: { items }
        });
    } catch (err) {
        next(err);
    }
};

// Add item to shopping list 

export const addItem = async (req, res, next) => {
    try {
        const item = await ShoppingList.create(req.user.id, req.body);

        res.status(201).json({
            success: true,
            message: "Item added to shopping list",
            data: { item }
        });
    } catch (err) {
        next(err);
    }
};

// update shopping list from meal plan 

export const updateItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedItem = await ShoppingList.update(id, req.user.id, req.body);
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: "Shopping list item not found or not authorized",
            });
        }
        res.json({
            success: true,
            message: "Shopping list item updated successfully",
            data: { updatedItem },
        });
    } catch (err) {
        next(err);
    }
};

// Toggle item checked status 

export const toggleChecked = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await ShoppingList.toggleChecked(id, req.user.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Shopping list item not found or not authorized",
            });
        }
        res.json({
            success: true, 
            data: { item },
        });
    } catch (err) {
        next(err);
    }
};

// Delete item from shopping list

export const deleteItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await ShoppingList.delete(id, req.user.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Shopping list item not found or not authorized",
            });
        }
        res.json({
            success: true,
            message: "Shopping list item deleted successfully",
            data: { deleted },
        });
    } catch (err) {
        next(err);
    }
};

// Clear all checked items from shopping list

export const clearChecked = async (req, res, next) => {
    try {
        const clearedItems = await ShoppingList.clearChecked(req.user.id);
        res.json({
            success: true,
            message: "Checked items cleared from shopping list",
            data: { clearedItems }
        });
    } catch (err) {
        next(err);
    }
};

// Clear all items from shopping list

export const clearAll = async (req, res, next) => {
    try {
        const clearedItems = await ShoppingList.clearAll(req.user.id);
        res.json({
            success: true,
            message: "All items cleared from shopping list",
            data: { clearedItems }
        });
    } catch (err) {
        next(err);
    }
};

// Add checked items to Pantry 

export const addCheckedToPantry = async (req, res, next) => {
    try {
        const items = await ShoppingList.addCheckedToPantry(req.user.id);

        res.json({
            success: true,
            message: "Checked items added to pantry",
            data: { items }
        });
    } catch (err) {
        next(err);
    }
};



