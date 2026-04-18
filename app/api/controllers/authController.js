import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "resync-dev-secret";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const existing = User.findByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = User.create({ name, email, password });
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        onboarded: !!user.onboarded,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = User.findByEmailWithPassword(email);
    if (!user || !User.comparePassword(user, password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user.id);
    const onboardingData = User.getOnboardingData(user);

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        onboarded: !!user.onboarded,
        onboardingData,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const onboardingData = User.getOnboardingData(user);

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        onboarded: !!user.onboarded,
        onboardingData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const completeOnboarding = async (req, res) => {
  try {
    const { purpose, mainGoals, preferredFrequency } = req.body;
    const userId = req.user.id;

    const user = User.update(userId, {
      onboarded: true,
      purpose,
      mainGoals,
      preferredFrequency,
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        onboarded: !!user.onboarded,
        onboardingData: User.getOnboardingData(user),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};