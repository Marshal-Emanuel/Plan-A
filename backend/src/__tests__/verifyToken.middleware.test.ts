import { verifyToken, isAdmin, isManager, isUser, ExtendedRequest } from '../middlewares/verifyToken';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { tokenInfo } from '../interfaces/users';

jest.mock('jsonwebtoken');

describe('verifyToken middleware', () => {
  let mockRequest: Partial<ExtendedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
        headers: {}
      };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    process.env.JWT_SECRET = 'test-secret';
  });

  test('should pass with valid token', async () => {
    mockRequest.headers = { authorization: 'Bearer valid-token' };
    (jwt.verify as jest.Mock).mockReturnValue({ userId: '123', role: 'user' });

    await verifyToken(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.info).toEqual({ userId: '123', role: 'user' });
  });

  test('should return 401 with no token', async () => {
    await verifyToken(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Access denied. Please log in again." });
  });

  test('should return 401 with invalid token', async () => {
    mockRequest.headers = { authorization: 'Bearer invalid-token' };
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });

    await verifyToken(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid token. Please log in again." });
  });

  test('should return 401 with expired token', async () => {
    mockRequest.headers = { authorization: 'Bearer expired-token' };
    (jwt.verify as jest.Mock).mockImplementation(() => { throw { name: 'TokenExpiredError' }; });

    await verifyToken(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid token. Please log in again." });

  });
});

describe('Role-based middleware', () => {
  let mockRequest: Partial<ExtendedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('isAdmin should pass for admin role', () => {
    mockRequest.info = { role: 'admin' } as tokenInfo;
    isAdmin(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  test('isAdmin should fail for non-admin role', () => {
    mockRequest.info = { role: 'user' } as tokenInfo;
    isAdmin(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'You are not authorized to perform this operation.' });
  });

  test('isManager should pass for manager role', () => {
    mockRequest.info = { role: 'manager' } as tokenInfo;
    isManager(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  test('isUser should pass for user role', () => {
    mockRequest.info = { role: 'user' } as tokenInfo;
    isUser(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
