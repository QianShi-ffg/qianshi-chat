import { Injectable, Headers, Ip, HostParam } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as dayjs from 'dayjs';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { CountToken } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(CountToken)
    private CountTokenRepository: Repository<CountToken>,
    private httpService: HttpService,
  ) {}

  /**
   * 查询token数据
   */
  countToken() {
    return this.CountTokenRepository.findOne({
      where: { id: 1 },
    });
  }

  /**
   * 上传接口
   * @param file 文件
   * @returns
   */
  async uploadFile(file) {
    // 获取文件的后缀
    const ext = extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    await this.createMkdir();
    const writeStream = createWriteStream(
      join(__dirname, '../public/uploads', filename),
    );
    writeStream.write(file.buffer);
    return {
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
      path: `/uploads/${filename}`,
    };
  }

  createMkdir() {
    if (!existsSync(join(__dirname, '../public'))) {
      mkdirSync(join(__dirname, '../public'));
      if (!existsSync(join(__dirname, '../public/uploads'))) {
        mkdirSync(join(__dirname, '../public/uploads'));
      }
    } else {
      if (!existsSync(join(__dirname, '../public/uploads'))) {
        mkdirSync(join(__dirname, '../public/uploads'));
      }
    }
  }
}
