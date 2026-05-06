import Recipe from "../models/Recipe.js";
import PantryItem from "../models/PantryItem.js";
import {
  generateRecipe as generateRecipeAI,
  generatePantrySuggestions as generatePantrySuggestionAI,
} from "../utils/gemini.js";
import { parse } from "dotenv";

// Generate recipe using AI
export const generateRecipe = async (req, res, next) => {
  try {
    const {
      ingredients = [],
      usePantryIngredients = false,
      dietaryRestrictions = [],
      cuisineType = "any",
      servings = 4,
      cookingTime = "medium",
    } = req.body;

    let finalIngredients = [...ingredients];

    //  Add Pantry ingredients if requested
    if (usePantryIngredients) {
      const pantryItems = await PantryItem.findByUserId(req.user.id);
      const pantryIngredients = pantryItems.map((item) => item.name);
      finalIngredients = [
        ...new Set([...finalIngredients, ...pantryIngredients]),
      ];
    }

    if (finalIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide at least one ingredient or enable pantry ingredients.",
      });
    }

    // Generate recipe using AI
    const recipe = await generateRecipeAI({
      ingredients: finalIngredients,
      dietaryRestrictions,
      cuisineType,
      servings,
      cookingTime,
    });

    res.json({
      success: true,
      message: "Recipe generated successfully",
      data: { recipe },
    });
  } catch (err) {
    next(err);
  }
};

// Get smart pantry suggestions
export const getPantrySuggestions = async (req, res, next) => {
  try {
    const pantryItems = await PantryItem.findByUserId(req.user.id);
    const expiringItems = await PantryItem.getExpiringSoon(req.user.id, 7);

    const expiringNames = expiringItems.map((item) => item.name);
    const suggestions = await generatePantrySuggestionAI(
      pantryItems,
      expiringNames,
    );
    res.json({
      success: true,
      data: { suggestions },
    });
  } catch (err) {
    next(err);
  }
};

// Save recipe
export const saveRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.create(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Recipe saved successfully",
      data: { recipe },
    });
  } catch (err) {
    next(err);
  }
};

// Get all recipes 

export const getRecipes = async (req, res, next) => {
    try {
        const {search, cuisine_type, difficulty, dietary_tag, max_cooking_time, sort_by, sort_order, limit, offset} = req.query;
        const recipes = await Recipe.findByUserId(req.user.id, {
            search,
            cuisine_type,
            difficulty,
            dietary_tag,
            max_cooking_time,
            sort_by,
            sort_order,
            limit,
            offset
        });
        res.json({
            success: true,
            data: { recipes }
        });
    } catch (err) {
        next(err);
    }
};

// Get recent recipes 

export const getRecentRecipes = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const recipes = await Recipe.getRecent(req.user.id, limit);
        res.json({
            success: true,
            data: { recipes }
        });
    } catch (err) {
        next(err);
    }
};

// Get recipe by id
export const getRecipeById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const recipe = await Recipe.findById(id, req.user.id);
        
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found",
            });
        }
        res.json({
            success: true,
            data: { recipe }
        });
    } catch (err) {
        next(err);
    }
};

// update recipe

export const updateRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedRecipe = await Recipe.update(id, req.user.id, req.body);

    if (!updatedRecipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found or not authorized",
      });
    }

    res.json({
      success: true,
      message: "Recipe updated successfully",
      data: { recipe: updatedRecipe },
    });

  }catch (err) {
    next(err);
  }
};

// delete recipe 

export const deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.delete(id, req.user.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found or not authorized",
        data: {recipe}
      });
    }

  } catch (err) {
    next(err);
  }
};

// Get recipe stats 

export const getRecipeStats = async (req, res, next) => {
  try {
    const stats = await Recipe.getStats(req.user.id);
    res.json({
      success: true,
      data: { stats }
    });
  } catch (err) {
    next(err);
  };
};
