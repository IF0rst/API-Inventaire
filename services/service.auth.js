import database from "../db.js";
import bcrypt from "bcrypt";
import {v4} from "uuid";
import jwt from "jsonwebtoken";
import 'dotenv/config'

const createToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '15m'})
}

export const register = (username, password) => {
    const stmtUser = database.prepare("SELECT username FROM user WHERE username = :username");
    const row = stmtUser.get({username});

    if (row) {
        throw new Error("user already exists");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = v4();

    const stmt = database.prepare("INSERT INTO user (userId, username, passwordHash) VALUES (:userId, :username, :passwordHash)");
    stmt.run({
        userId: userId, username: username, passwordHash: hashedPassword,
    });
};

export const login = (username, password) => {
    const stmtUser = database.prepare("SELECT userId,passwordHash FROM user WHERE username = :username");
    const row = stmtUser.get({username});

    if (!row) {
        throw new Error("Invalid username or password");
    }
    if (!bcrypt.compareSync(password, row.passwordHash)) {
        throw new Error("Invalid username or password");
    }

    const token = createToken(row.userId)
    return token
}

export const checkJWT = (_jwt) => {
    if (jwt.verify(_jwt, process.env.JWT_SECRET)) {
        const {userId} = jwt.decode(_jwt, process.env.JWT_SECRET)

        if (!userId) {
            throw new Error("Invalid JWT!");
        }

        const stmtUser = database.prepare("SELECT userId,username FROM user WHERE userId = :userId");
        const row = stmtUser.get({userId});

        return row
    } else {
        throw new Error("invalid JWT!")
    }
}