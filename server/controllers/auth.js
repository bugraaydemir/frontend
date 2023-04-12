import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*Registeration of Users*/
export const register = async(req,res)=>{
    try{
        const{
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        
        } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)
        const newUser = new User ({
            firstName,
            lastName,
            email,
            password : passwordHash,
            picturePath,
            friends,
            location,
            occupation            
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json({error : err.message})
    }
};


/*Login*/


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        const rememberMe = req.body.rememberMe;

        if (!user) {
            return res.status(400).json({ msg: "User Does Not Exist!" });
        }

        if (rememberMe) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            res.cookie("rememberMeToken", token, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                httpOnly: true,
                secure: true,
            });
        } else {
            res.clearCookie("rememberMeToken");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Password!" });
        }

        // check for existing token
        const existingToken = user.token;

        if (existingToken) {
            // check if token is expired
            const decodedToken = jwt.verify(existingToken, process.env.JWT_SECRET);
            if (decodedToken.exp < Date.now() / 1000) {
                // generate a new token
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: 86400
                });
                user.token = token;
                await user.save();
                delete user.password;
                return res.status(200).json({ token, user });
            }
            // token is still valid
            delete user.password;
            return res.status(200).json({ token: existingToken, user });
        }

        // generate a new token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 86400
        });
        user.token = token;
        await user.save();
        delete user.password;
        res.status(200).json({ token, user });

    } catch (err) {
        res.status(500).json({ error: "Expired" });
    }
};

