import mongoose from "mongoose";

import User from "../models/User.model.js";

function getBootstrapCredentials() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !password) return null;

  return { email, password };
}

export async function ensureAdminUser() {
  const credentials = getBootstrapCredentials();
  if (!credentials || mongoose.connection.readyState !== 1) {
    return null;
  }

  const { email, password } = credentials;
  const adminName = process.env.ADMIN_NAME?.trim() || "RUGAN Admin";

  let admin = await User.findOne({ email }).select("+password");

  if (!admin) {
    admin = await User.create({
      name: adminName,
      email,
      password,
      role: "admin",
      isActive: true,
    });

    console.log("Bootstrap admin user created.");
    return admin;
  }

  let shouldSave = false;

  if (admin.role !== "admin") {
    admin.role = "admin";
    shouldSave = true;
  }

  if (!admin.isActive) {
    admin.isActive = true;
    shouldSave = true;
  }

  if (admin.name !== adminName) {
    admin.name = adminName;
    shouldSave = true;
  }

  if (!(await admin.matchPassword(password))) {
    admin.password = password;
    shouldSave = true;
  }

  if (shouldSave) {
    await admin.save();
    console.log("Bootstrap admin user updated.");
  }

  return admin;
}
