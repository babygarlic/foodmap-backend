import { HttpException, HttpStatus, Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { hashingPassword } from 'src/helpers/utils';
import { BadRequestException } from '@nestjs/common';
import aqp from 'api-query-params'
import { MESSAGES } from '@nestjs/core/constants';
import { NOTFOUND } from 'dns';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel : Model<User>  
  ){}

  checkEmailExist =async (email:string)=>{
    const user = await this.userModel.exists({email:email})
    console.log(user)
    if (user) return true
    else return false
  }
  // check xem id có tồn tại hay k
  chechIDExist = async (id: string) =>{
    const user = await this.userModel.exists({_id:id})
    if(user) return true
    else return false
  }
  
  async create(createUserDto: CreateUserDto) {
    const {name, password, email, phone, image, address} = createUserDto
    // check email trước khi tạo user
    const isexist = await this.checkEmailExist(email)
    if (isexist){
      throw new BadRequestException(`Email:${email} already exists`)
    }else{
      // hash password trước khi tạo user
      const hashPassword = await hashingPassword(password)
      const user =  await this.userModel.create({
      name: name, email: email, password: hashPassword, phone: phone, image: image, address: address
    })
    if (user){
        return {
        statuscode: HttpStatus.CREATED,
        message: "Create user successfull",
        id: user._id,
        userName: user.name
      }
    }
    
    }
  }

 async findAll(query: string) {
  const { default: aqp } = await import('api-query-params')
  const { filter,sort} = aqp(query);

  if(!filter.current) filter.current = 1
  if(!filter.pageSize) filter.pageSize = 10

  const toltalUser = (await this.userModel.find()).length
  const toltalPage = Math.ceil(+toltalUser/(+filter.pageSize))
  const skip = (+filter.current-1)*(+filter.pageSize)

  const page_user = await this.userModel
    .find()
    .limit(filter.pageSize)
    .skip(skip)
    .sort(sort as any)
    .select("-password")

    return {page_user, toltalPage}
  }

  async findOne(email: string):Promise<User | undefined>{
    return await this.userModel.findOne({email: email}) || undefined
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const isExitID = await this.chechIDExist(id)
    if (isExitID){
      await this.userModel.findByIdAndUpdate({_id: id},{...updateUserDto})
      return {
        status_code: HttpStatus.OK,
        message:"Update successfull!"
      }
    }
    else {
      throw new NotFoundException('ID not available!')
    }
    
  }

 async remove(id:string) {
    const isdelete = await this.userModel.findByIdAndDelete(id)
    if (!isdelete) {
      throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          MESSAGES: 'User ID does not exist!',
        },HttpStatus.NOT_FOUND)
      }else{
        return {
              statusCode: HttpStatus.OK,
              message: 'Successful!',
            };
      }
 
    
  }
}
