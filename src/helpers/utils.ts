import bcrypt from 'bcrypt'

const saltRounds = 10 

export const hashingPassword = async (plainPassword: string)=>{
    try{
        return await bcrypt.hash(plainPassword,saltRounds)
    } catch (error){
        console.log(error)
    }
}
