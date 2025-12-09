'use server';

import { prisma } from '@/lib/prisma';
import { hashPassword, validatePassword, validateUsername, comparePassword } from '@/lib/auth-utils';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import crypto from 'crypto';

export async function signUpAction(formData: FormData) {
  const username = (formData.get('username') as string)?.toLowerCase().trim();
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validate inputs
  if (!username || !password || !confirmPassword) {
    return { error: 'All fields are required' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  // Validate username
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return { error: usernameValidation.error };
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { error: passwordValidation.error };
  }

  // Check if username already exists
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return { error: 'Username already taken' };
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  try {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Auto sign in after signup
    await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }
}

export async function signInAction(formData: FormData) {
  const username = (formData.get('username') as string)?.toLowerCase().trim();
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  try {
    await signIn('credentials', {
      username,
      password,
      redirectTo: '/projects',
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid username or password' };
        default:
          return { error: 'Something went wrong. Please try again.' };
      }
    }
    throw error;
  }
}

export async function requestPasswordResetAction(formData: FormData) {
  const username = (formData.get('username') as string)?.toLowerCase().trim();

  if (!username) {
    return { error: 'Username is required' };
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { username },
  });

  // Always return success message for security (don't reveal if user exists)
  if (!user || !user.password) {
    return {
      message: 'If a user with that username exists, password reset instructions have been sent.'
    };
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  // Save reset token to database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  // In a real app, you would send an email here with the reset link
  // For now, we'll just log it to the console
  console.log(`Password reset token for ${username}: ${resetToken}`);
  console.log(`Reset link: http://localhost:3000/auth/reset-password/${resetToken}`);

  return {
    message: 'Password reset token generated. Check the server console for the reset link.'
  };
}

export async function changePasswordAction(formData: FormData) {
  const username = (formData.get('username') as string)?.toLowerCase().trim();
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!username || !currentPassword || !newPassword || !confirmPassword) {
    return { error: 'All fields are required' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match' };
  }

  // Validate new password
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    return { error: passwordValidation.error };
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !user.password) {
    return { error: 'User not found' };
  }

  // Verify current password
  const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    return { error: 'Current password is incorrect' };
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  return { success: true };
}

export async function resetPasswordWithTokenAction(formData: FormData) {
  const token = formData.get('token') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!token || !newPassword || !confirmPassword) {
    return { error: 'All fields are required' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  // Validate new password
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    return { error: passwordValidation.error };
  }

  // Find user with valid reset token
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(), // Token must not be expired
      },
    },
  });

  if (!user) {
    return { error: 'Invalid or expired reset token' };
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { success: true };
}
