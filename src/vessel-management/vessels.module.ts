import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { MdmVslCntr } from 'src/common/entities/MdmVslCntr.entity';
import { VesselsService } from './services/vessels.service';
import { VesselsController } from './controllers/vessels.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MdmVslCntr]), forwardRef(() => AppModule)],
    providers: [
        VesselsService
    ],
    controllers: [VesselsController],
    exports: [TypeOrmModule]
})
export class VesselsModule {}
