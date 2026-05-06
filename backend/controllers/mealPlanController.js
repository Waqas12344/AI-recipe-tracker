import MealPlan from '../models/MealPlan.js';

// Add recipe to meal plan 

export const addToMealPlan = async (req, res, next) => {
    try {
        const mealPlanEntry = await MealPlan.create(req.user.id, req.body);

        res.status(201).json({
            success: true,
            message: "Recipe added to meal plan",
            data: { mealPlanEntry }
        });
    } catch (err) {
        next(err);
    }
};

export const getWeeklyMealPlan = async (req, res, next) => {
    try {
        const {start_date, weekStartDate } = req.query;
        const startDate = weekStartDate || start_date;

        if (!startDate) {
            return res.status(400).json({
                success: false,
                message: "start_date or weekStartDate query parameter is required",
            });
        }

        const mealPlan = await MealPlan.getWeeklyPlan(req.user.id, startDate);

        res.json({
            success: true,
            data: { mealPlan }
        });
    } catch (err) {
        next(err);
    }
};

// Get upcoming meals 
export const getUpcomingMeals = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const meals = await MealPlan.getUpcoming(req.user.id, limit);

        res.json({
            success: true,
            data: { meals }
        });
    } catch (err) {
        next(err);
    }
};

// Delete meal from meal plan 

export const deleteMealPlan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await MealPlan.delete(id, req.user.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Meal plan entry not found or not authorized",
            });
        }

        res.json({
            success: true,
            message: "Meal plan entry deleted successfully",
            data: { deleted }
        });
    } catch (err) {
        next(err);
    }
};

// get meal plan stats 

export const getMealPlanStats = async (req, res, next) => {
    try {
        const stats = await MealPlan.getStats(req.user.id);

        res.json({
            success: true,
            data: { stats }
        });
    } catch (err) {
        next(err);
    }
};


