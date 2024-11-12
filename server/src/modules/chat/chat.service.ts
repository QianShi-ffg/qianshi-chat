import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import OpenAI from 'openai';
import { ScanStatus, WechatyBuilder, log } from 'wechaty';
import { qrTerm } from 'qrcode-terminal';

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

const openai = new OpenAI({
  apiKey: 'sk-Lg7KRKmzcCD6bgSYZeCuMgTRs3nnZelPkcXYXuj9FFNW5HPD',
  baseURL: 'https://api.moonshot.cn/v1',
});
@Injectable()
export class ChatService implements OnModuleInit {
  constructor(
    @InjectRepository(Chat)
    private ChatRepository: Repository<Chat>,
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
    console.log(1111111111111111, '启动');
    const bot = WechatyBuilder.build({
      name: '沙雕机器人',
    });

    bot
      .on('scan', (qrcode, status) =>
        console.log(
          `Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(
            qrcode,
          )}`,
        ),
      )
      .on('login', (user) => console.log(`User ${user} logged in`))
      .on('message', async (message) => {
        const room = message.room()
        const contact = message.talker()
        const text = message.text()
        const self = message.self()
        const type = message.type()
        if (room && await room.topic() === '算法与架构的成长计划') {
          console.log(await room.topic())
          console.log(`Message: ${message}`)
          console.log(`contact: ${contact.name()}`)
          console.log(`text: ${text}`)
          console.log(`self: ${self}`)
          console.log(`type: ${type}`)
          console.log(`room: ${room}`)
          if (message.text().includes('@一十六')) {
            // type 撤回 13, 文字 7, 图片 6
            const res = await this.createChat(message)
            // 返回结果
            // await room.say(res.choices[0].message.content);
          }
        } else {
          if (contact.name() === '千拾') {
            const res = await this.createChat(message)
            // 返回结果
            // await room.say(res.choices[0].message.content);
          }
        }
      })
      .start();
    // const openai = new OpenAIApi(configuration);
    // try {
    //   const completion = await openai.createCompletion({
    //     prompt: message,
    //     model: 'text-davinci-003',
    //     temperature: 0.8,
    //     max_tokens: 1024,
    //     top_p: 1,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.6,
    //     stop: ['Human:', 'AI:'],
    //   });
    //   console.log(completion.data.choices[0].text);
    //   return {
    //     code: 200,
    //     data: completion.data.choices,
    //     message: '获取数据成功',
    //   };
    // } catch (error) {
    //   if (error.response) {
    //     console.log(error.response.status);
    //     console.log(error.response.data);
    //   } else {
    //     console.log(error.message);
    //   }
    // }
    // const response = await openai11.listEngines();
  }

  async createChat(message) {
    let finishReason = null;
    const res = await openai.chat.completions.create({
      model: 'moonshot-v1-8k',
      messages: [
        {
          role: 'user',
          content: message.text().replace('@一十六', ''),
        }
      ],
      tools: [
        {
          "type": null,
          "function": {
              "name": "$web_search",
          },
        }
      ],
      temperature: 0.3,
    });
    const choice = res.choices[0];
    console.log(choice.message.content);
    // finishReason = choice.finish_reason;
    // console.log(finishReason);
    // if (finishReason === "tool_calls") { // <-- 判断当前返回内容是否包含 tool_calls
    //     // messages.push(choice.message); // <-- 我们将 Kimi 大模型返回给我们的 assistant 消息也添加到上下文中，以便于下次请求时 Kimi 大模型能理解我们的诉求
    //     for (const toolCall of choice.message.tool_calls) { // <-- tool_calls 可能是多个，因此我们使用循环逐个执行
    //         const tool_call_name = toolCall.function.name;
    //         const tool_call_arguments = JSON.parse(toolCall.function.arguments); // <-- arguments 是序列化后的 JSON Object，我们需要使用 JSON.parse 反序列化一下
    //         if (tool_call_name == "$web_search") {
    //             console.log('????');
    //           tool_result = tool_call_arguments
    //         } else {
    //           tool_result = 'no tool found'
    //         }


    //         // 使用函数执行结果构造一个 role=tool 的 message，以此来向模型展示工具调用的结果；
    //         // 注意，我们需要在 message 中提供 tool_call_id 和 name 字段，以便 Kimi 大模型
    //         // 能正确匹配到对应的 tool_call。
    //         console.log("toolCall.id");
    //         console.log(toolCall.id);                
    //         console.log("tool_call_name");
    //         console.log(tool_call_name);
    //         console.log("tool_result");
    //         console.log(tool_result);                
    //         messages.push({
    //             "role": "tool",
    //             "tool_call_id": toolCall.id,
    //             "name": tool_call_name,
    //             "content": JSON.stringify(tool_result), // <-- 我们约定使用字符串格式向 Kimi 大模型提交工具调用结果，因此在这里使用 JSON.stringify 将执行结果序列化成字符串
    //         });
    //     }
    // }
    // console.log(choice.message.content);
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
