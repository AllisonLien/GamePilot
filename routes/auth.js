// routes/auth.js
const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const { getGamesByIds } = require('../helpers/gameHelper');  
const crypto = require('crypto');
const requireAuth = require('../middleware/requireAuth');
// GET /auth/register 
router.get('/register', (req, res) => {
  res.render('auth/register', {
    errors: [],
    formData: {},
  });
});

// POST /auth/register 
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;
    const errors = [];

    if (!username || username.trim() === '') errors.push('Username is required.');
    if (!email || email.trim() === '')        errors.push('Email is required.');
    if (!password || password.length < 6)     errors.push('Password must be at least 6 characters.');

    if (errors.length > 0) {
      return res.status(400).render('auth/register', {
        errors,
        formData: req.body,
      });
    }

    //check if username / email is already registered
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).render('auth/register', {
        errors: ['Username or email already registered.'],
        formData: req.body,
      });
    }

    const newUser = new User({ username, email, password, displayName });
   await newUser.save();
req.session.flash = { type: 'success', message: 'Account created! Please log in.' };
res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
// GET /auth/login — 
router.get('/login', (req, res) => {
  res.render('auth/login', {
    errors: [],
    formData: {},
  });
});

// POST /auth/login 
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;   // identifier = username 或 email
    const errors = [];

    if (!identifier || identifier.trim() === '') errors.push('Username or email is required.');
    if (!password) errors.push('Password is required.');

    if (errors.length > 0) {
      return res.status(400).render('auth/login', {
        errors,
        formData: req.body,
      });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier.toLowerCase() }]
    });

    if (!user) {
      return res.status(400).render('auth/login', {
        errors: ['Invalid username/email or password.'],
        formData: req.body,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).render('auth/login', {
        errors: ['Invalid username/email or password.'],
        formData: req.body,
      });
    }

    req.session.userId   = user._id;
    req.session.username = user.username;
    req.session.flash = { type: 'success', message: `Welcome back, ${user.displayName || user.username}!` };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /auth/logout 
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.redirect('/auth/login');
  });
});
// GET /auth/profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('auth/profile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
// GET /auth/profile/edit 
router.get('/profile/edit', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('auth/profile-edit', {
      errors: [],
      formData: {
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /auth/profile/edit
router.post('/profile/edit', requireAuth, async (req, res) => {
  try {
    const { email, displayName } = req.body;
    const errors = [];

    if (!email || email.trim() === '') errors.push('Email is required.');

    if (errors.length > 0) {
      return res.status(400).render('auth/profile-edit', {
        errors,
        formData: req.body,
      });
    }

    // check if email is already registered by another user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: req.session.userId },   // except for the current user
    });

    if (existingUser) {
      return res.status(400).render('auth/profile-edit', {
        errors: ['This email is already in use.'],
        formData: req.body,
      });
    }

    await User.findByIdAndUpdate(req.session.userId, {
      email: email.toLowerCase().trim(),
      displayName: displayName ? displayName.trim() : '',
    });

    res.redirect('/auth/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /auth/favorites 
router.get('/favorites', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const games = await getGamesByIds(user.favoriteGames || []);
    res.render('auth/favorites', { games });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /auth/profile/change-password 
router.get('/profile/change-password', requireAuth, (req, res) => {
  res.render('auth/change-password', { errors: [] });
});

// POST /auth/profile/change-password 
router.post('/profile/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const errors = [];

    if (!currentPassword) errors.push('Current password is required.');
    if (!newPassword || newPassword.length < 6) errors.push('New password must be at least 6 characters.');
    if (newPassword !== confirmPassword) errors.push('New password and confirmation do not match.');

    if (errors.length > 0) {
      return res.status(400).render('auth/change-password', { errors });
    }

    const user = await User.findById(req.session.userId);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).render('auth/change-password', {
        errors: ['Current password is incorrect.'],
      });
    }

    user.password = newPassword;
    await user.save();   // pre-save hook

    req.session.flash = { type: 'success', message: 'Password updated successfully.' };
    res.redirect('/auth/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
// GET /auth/forgot-password 
router.get('/forgot-password', (req, res) => {
  res.render('auth/forgot-password', { errors: [] });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase().trim() });

    if (!user) {
      return res.render('auth/forgot-password', {
        errors: ['If that email exists, a reset link has been generated below.'],
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken   = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30;   
    await user.save();

    const resetLink = `${req.protocol}://${req.get('host')}/auth/reset-password/${token}`;

    res.render('auth/forgot-password-link', { resetLink });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /auth/reset-password/:token 
router.get('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },   
    });

    if (!user) {
      return res.status(400).send('This password reset link is invalid or has expired.');
    }

    res.render('auth/reset-password', { token: req.params.token, errors: [] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /auth/reset-password/:token 
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const errors = [];

    if (!newPassword || newPassword.length < 6) errors.push('Password must be at least 6 characters.');
    if (newPassword !== confirmPassword) errors.push('Passwords do not match.');

    if (errors.length > 0) {
      return res.status(400).render('auth/reset-password', { token: req.params.token, errors });
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send('This password reset link is invalid or has expired.');
    }

    user.password = newPassword;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.session.flash = { type: 'success', message: 'Password reset successful. Please log in.' };
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
module.exports = router;