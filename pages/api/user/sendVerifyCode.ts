import type { NextApiRequest, NextApiResponse } from 'next';
import { SmsAccountSID, SmsAuthToken, SmsTestBaseUrl, SmsAppId } from 'utils/sms';
import md5 from "md5";
import { format } from 'date-fns';
import { encode } from 'js-base64';
import requestInstance from 'service/fetch';
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { ExpireMinutes } from 'utils/sms';

interface SMS_Type {
    statusCode: string,
    templateSMS: {
        dateCreated: string,
        smsMessageSid: string,
    },
    statusMsg?: string,
}

// 测试收到的短信：【云通讯】您使用的是云通讯短信模板，您的验证码是9735，请于5分钟内正确输入
// https://doc.yuntongxun.com/p/5a533de33b8496dd00dce07c
async function sedVerifyCode(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<SMS_Type & {code: number}>>) {
    const session: ISession = req.session; // withIronSessionApiRoute 会自动注入
    const { to = '', templateId = '1' } = req.body;
    const nowDate = format(new Date(), 'yyyyMMddHHmmss');
    const SigParameter = md5(SmsAccountSID + SmsAuthToken + nowDate).toUpperCase();
    const Authorization = encode(`${SmsAccountSID}:${nowDate}`);
    const url = `${SmsTestBaseUrl}/2013-12-26/Accounts/${SmsAccountSID}/SMS/TemplateSMS?sig=${SigParameter}`;
    // 线上服务器是分布式部署，一般是把验证码保存在redis中
    // 该项目是个练习项目，保存到本地即可
    const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    const expireMinutes = ExpireMinutes;
    // todo 开发环境就不请求验证码了
    let response = {
        "statusCode":"000000",
        "templateSMS":{"smsMessageSid":"8a483be8ec344a5ea2c857a8038fc095","dateCreated":"20221111163118"},
    }
    if(process.env.NODE_ENV !== 'development') {
        response = await requestInstance.post<any, SMS_Type>(url, {
            to,
            templateId,
            appId: SmsAppId,
            datas: [verifyCode, expireMinutes],
        }, {
            headers: {
                Authorization,
            }
        });
    }

    const { statusCode, templateSMS, statusMsg = '' } = response;
    if (statusCode === '000000') {
        session.verifyCode = verifyCode;
        session.verifyExpireDate = new Date();
        await session.save();

        res.status(200).json({
            code: 0,
            msg: '验证码发送成功',
            data: {
                code: verifyCode,
                ...response
            },
        });
    } else {
        res.status(200).json({
            // @ts-ignore
            code: statusCode,
            msg: statusMsg || '验证码请求失败，请重试',
            data: {
                code: verifyCode,
                ...response
            },
        });
    }

}
export default withIronSessionApiRoute(sedVerifyCode, ironOptions);
