import { HTTP_STATUS } from '../constants/http.js';
import { createUser } from '../services/auth.service.js';
import catchAsync from '../utils/catchAsync.js';

export const handleSignup = catchAsync(async (req, res) => {
  const { fullName, email, password } = req.body;

  const user = await createUser({ fullName, email, password });

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    data: user,
  });
});
