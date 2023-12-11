const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const EmployeeSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String
})
EmployeeSchema.pre('save', async function(next) {
    const employee = this;
    if (!employee.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(employee.password, 10);
        employee.password = hashedPassword;
        return next();
    } catch (error) {
        return next(error);
    }
});



const EmployeeModel=mongoose.model("employees",EmployeeSchema)
module.exports=EmployeeModel