import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { hashingPassword } from 'src/helpers/utils';
import { BadRequestException } from '@nestjs/common';
import aqp from 'api-query-params'
import { MESSAGES } from '@nestjs/core/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel : Model<User>  
  ){}

  checkIsExist =async (params:string )=>{
    const user = await this.userModel.exists({params})
    if (user) return true
    else return false
  }
  
  async create(createUserDto: CreateUserDto) {
    const {name, password, email, phone, image} = createUserDto
    // check email trước khi tạo user
    const isexist = await this.checkIsExist(email)
    if (isexist){
      throw new BadRequestException(`Email:${email} already exists`)
    }
    // hash password trước khi tạo user
    const hashPassword = await hashingPassword(password)
    const user =  await this.userModel.create({
      name: name, email: email, password: hashPassword, phone: phone, image: image
    })
    return {
      id: user._id,
      userName: user.name
    };
  }

 async findAll(query: string) {
  const { default: aqp } = await import('api-query-params')
  const { filter,sort} = aqp(query);

  const toltalUser = (await this.userModel.find()).length
  const toltalPage = Math.ceil(toltalUser/(+filter.pageSize))
  const skip = (+filter.current-1)*(+filter.pageSize)

  if(!filter.current) filter.current = 1
  if(!filter.pageSize) filter.pageSize = 10

  const page_user = await this.userModel
    .find()
    .limit(filter.pageSize)
    .skip(skip)
    .sort(sort as any)
    .select("-password")

    return {page_user, toltalPage}
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id) 
    return{
      user_id: user?._id,
      username: user?.name,
      email: user?.email,
      phone: user?.phone,
      Image: user?.image
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    
    return `This action updates a #${id} user`;
  }

 async remove(id:string) {
    const isExistID= await this.checkIsExist(id)
    if(isExistID){
      const isdelete = await this.userModel.findByIdAndDelete(id).select("-password")
      if (isdelete) {
      } else {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          MESSAGES: 'User ID does not exist!',

        },HttpStatus.NOT_FOUND)
      }
 
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Successful!',
    };
  }
}
