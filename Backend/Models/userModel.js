const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

//static signup method
userSchema.statics.signup = async function(email, password) {
    //validator
    if(!email || !password){
        throw Error('Please provide all the fields')
    }
    if(!validator.isEmail(email)){
        throw Error('Please provide a valid email')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Please provide a valid password')
    }

    const exits = await this.findOne({email})
    if (exits) {
        throw new Error('Email already exists')
    }
    const salt =await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({email, password: hash})
    return user

}
//static login method
userSchema.statics.login = async function(email, password) {
    if(!email || !password){
        throw Error('Please provide all the fields')
    }
    const user = await this.findOne({email})
    if (!user) {
        throw new Error('Email does not exist')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Password is incorrect')
    }
    return user
}
module.exports = mongoose.model('User', userSchema)