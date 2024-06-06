const joi = require('@hapi/joi')

//left side of object must be matched with name property of input 
const signupValidation = (data) => {
    const schema = joi.object({
        name:joi.string().min(2).required(),
        uname:joi.string().min(3).required(),
        email:joi.required(),
        pswd:joi.string().min(4).required(),
        stoken:joi.string()
    })
    return schema.validate(data)
}

const signInValidation = (data) => {
    data.email = data.email[0]
    data.password = data.password[0]
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).required()
    })
    return schema.validate(data)
}

const customerProfile = (data) => {
    const schema = joi.object({
        cont:joi.string().regex(/^[0-9]+$/).required().length(10),
        city:joi.string().min(2),
        area:joi.string().min(2)    
    })
    return schema.validate(data)
} 

const bakerProfile = (data) => {
    const schema = joi.object({
        bname:joi.string().min(2).required(),
        whatdousell:joi.string().min(5).required(),
        availTime:joi.string().min(4).required(),
        city:joi.string().min(2).required(),
        area:joi.string().min(2).required(),
        cont:joi.string().min(2).required(),
        socialmedia:joi.string().min(2).required()
    })
    return schema.validate(data)
}

module.exports.signInValidation = signInValidation
module.exports.signupValidation = signupValidation
module.exports.customerProfile = customerProfile
module.exports.bakerProfile = bakerProfile