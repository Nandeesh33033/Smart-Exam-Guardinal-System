import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role, studentID: user.studentID }, process.env.JWT_SECRET, {
    expiresIn: '12h'
  });

export const register = async (req, res) => {
  const { name, email, password, role = 'student', studentID } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role, studentID });
  return res.status(201).json({ token: signToken(user), user: { email: user.email, role: user.role, studentID: user.studentID } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.status(200).json({ token: signToken(user), user: { email: user.email, role: user.role, studentID: user.studentID, name: user.name } });
};
