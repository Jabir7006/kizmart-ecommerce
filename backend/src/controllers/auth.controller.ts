import { HTTP_STATUS } from '../constants/http.js';
import { createUser } from '../services/auth.service.js';
import catchAsync from '../utils/catchAsync.js';
import { setAuthCookies } from '../utils/cookies.js';

export const handleSignup = catchAsync(async (req, res) => {
  const { fullName, email, password } = req.body;

  const {user, accessToken, refreshToken} = await createUser({ fullName, email, password });


    setAuthCookies({res, accessToken, refreshToken})


  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message : 'Account created successfully',
    data : user 
  });
});
