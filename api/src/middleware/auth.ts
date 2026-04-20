import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * JWT authentication middleware.
 * Verifies the token and attaches the real user data to the request.
 */
export function authenticate(
	req: Request,
	_res: Response,
	next: NextFunction,
): void {
	const authHeader = req.headers.authorization;

	if (authHeader?.startsWith("Bearer ")) {
		const token = authHeader.slice(7);

		try {
			// Must match the secret used in your login route!
			const JWT_SECRET = process.env.JWT_SECRET || "super_secret_dev_key_123";

			// This cracks open the token to get the real { id, role } payload
			const decoded = jwt.verify(token, JWT_SECRET);

			(req as any).user = decoded;
			(req as any).token = token;
		} catch (error) {
			console.error("Invalid token rejected.");
			// If it fails, req.user remains undefined, and requireAuth will catch them
		}
	}

	next();
}

/**
 * Requires that the request has a valid authenticated user.
 */
export function requireAuth(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	if (!(req as any).user) {
		res.status(401).json({ error: "Authentication required" });
		return;
	}
	next();
}
