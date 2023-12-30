import { Controller, Post } from '@nestjs/common';


@Controller('users')
export class AppController {

    @Post('sign-in')
    getHello(): any {
        return { token: 'asdfklja8934hljk8934ljk8934hljk8934hljksldj' };
    }
}
