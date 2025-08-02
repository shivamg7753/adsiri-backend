"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            };
            next();
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, token failed'
            });
        }
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized, no token'
        });
    }
};
exports.protect = protect;
//# sourceMappingURL=auth.js.map