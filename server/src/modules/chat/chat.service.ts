import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import OpenAI from 'openai';
import { HttpService } from '@nestjs/axios';

import { ScanStatus, WechatyBuilder, log } from 'wechaty';
import { QRCodeTerminal } from 'wechaty-plugin-contrib'
import { qrTerm } from 'qrcode-terminal';
import { ConfigService } from '@nestjs/config';

export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
);
let conversationObj = {
  parentMessageId: null,
  conversationId: null,
};

let api = '';
let api1 = '';
let count = 0;
let count1 = 0;
let countTimeer = null;
let countTimeer1 = null;

// 消息列表
const systemMessages = [];
let messages = [];
@Injectable()
export class ChatService implements OnModuleInit {
  constructor(
    @InjectRepository(Chat)
    private ChatRepository: Repository<Chat>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    console.log(66666666);
    this.chat('');
  }

  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return this.ChatRepository.findOne({
      where: { id: id },
    });
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  /**
   *
   * @param message 输入值
   * @returns 返回值
   */
  async chat(message: string) {

    const openai = new OpenAI({
      apiKey: this.configService.get<string>('AI_CHAT_KEY'),
      baseURL: 'https://api.moonshot.cn/v1',
    });

    const bot = WechatyBuilder.build({
      name: '沙雕机器人',
    });

    bot.use(QRCodeTerminal({
      small: true
    }))

    bot
      .on('scan', (qrcode, status) => this.onScan(qrcode, status))
      .on('login', (user) => console.log(`User ${user} logged in`))
      // .on('heartbeat', async(data) => {
      //   console.log(data)
      //   const res = await this.createChat(message.text());
      // })
      .on('logout', async() => {
        // await bot.logout();
        // this.chat('')
      })
      .on('message', async (message) => {
        const room = message.room();
        const contact = message.talker();
        const text = message.text();
        const self = message.self();
        const type = message.type();
        console.log(`Message: ${message}`);
        console.log(`contact: ${contact.name()}`);
        console.log(`text: ${text}`);
        console.log(`self: ${self}`);
        console.log(`type: ${type}`); // type 撤回 13, 文字 7, 图片 6, 语音 2
        console.log(`room: ${room}`);
        if (!self) {
          if (room) {
            if (await room.topic() === '算法与架构的成长计划') {
              console.log(await room.topic());
              if (message.text().includes('@一十六')) {
                const res = await this.createChat(
                  openai, message.text().replace('@一十六', ''),
                );
                // 返回结果
                room.say(res);
              }
            } else {

            }
          } else {
            if (type === 7) {
              const res = await this.createChat(openai, message.text());
              // 返回结果
              message.say(res);
            }
            //  else {
            //   message.say(
            //     '抱歉，目前主人不在线，我是ai助手，我无法识别除文字以外的信息，请见谅',
            //   );
            // }
          }
        }
      })
      .start();
  }

  async createChat(openai, value) {
    const res = await openai.chat.completions.create({
      model: 'moonshot-v1-8k',
      messages: await this.makeMessages(value),
      temperature: 0.3,
    });
    // 通过 API 我们获得了 Kimi 大模型给予我们的回复消息（role=assistant）
    const assistantMessage = res.choices[0].message;

    // 为了让 Kimi 大模型拥有完整的记忆，我们必须将 Kimi 大模型返回给我们的消息也添加到 messages 中
    messages.push(assistantMessage);

    return assistantMessage.content;
  }

  async makeMessages(input, n = 20) {
    /**
     * 使用 make_messages 控制每次请求的消息数量，使其保持在一个合理的范围内，例如默认值是 20。在构建消息列表
     * 的过程中，我们会先添加 System Prompt，这是因为无论如何对消息进行截断，System Prompt 都是必不可少的
     * 内容，再获取 messages —— 即历史记录中，最新的 n 条消息作为请求使用的消息，在大部分场景中，这样
     * 能保证请求的消息所占用的 Tokens 数量不超过模型上下文窗口。
     */
    // 首先，我们将用户最新的问题构造成一个 message（role=user），并添加到 messages 的尾部
    messages.push({
      role: 'user',
      content: input,
    });

    // messages = messages.filter(item => {
    //   return item.content
    // })

    // newMessages 是我们下一次请求使用的消息列表，现在让我们来构建它
    let newMessages = [];

    // 每次请求都需要携带 System Messages，因此我们需要先把 systemMessages 添加到消息列表中；
    // 注意，即使对消息进行截断，也应该注意保证 System Messages 仍然在 messages 列表中。
    newMessages = systemMessages.concat(newMessages);

    // 在这里，当历史消息超过 n 条时，我们仅保留最新的 n 条消息
    if (messages.length > n) {
      messages = messages.slice(-n);
    }

    newMessages = newMessages.concat(messages);
    return newMessages;
  }

  onScan(qrcode, status) {
    // console.log(
    //   `Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(
    //     qrcode,
    //   )}`,
    // );
  }

  // 处理用户输入并生成响应
  async generateResponse(api, input) {
    // 将id输入添加到上下文中
    console.log(api);
    try {
      const res = await api.sendMessage(input, {
        conversationId: conversationObj.conversationId,
        parentMessageId: conversationObj.parentMessageId,
      });
      conversationObj = {
        conversationId: res.conversationId,
        parentMessageId: res.id,
      };
      const text = res.text;

      // 返回生成的响应
      return text;
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  }
}
