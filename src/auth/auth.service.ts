import { Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/module/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/helpers/utils';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(
    username: string,
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException({ message: "Email hoặc mật khẩu không đúng!" });
    }

    const isValidPassword = await comparePassword(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException({ message: "Email hoặc mật khẩu không đúng!" });
    }

    const payload = { sub: user._id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    
  }
}

