// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
// http://mockjs.com/
import {mock, Random} from 'mockjs';
type Data = {
    name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.status(200).json(
        mock({
            'list|1-20': [
                {
                    'name|1': [Random.cname(), Random.cname(), Random.cname()],
                    birth: Random.date('yyyy-mm-dd'),
                    'id|+1': 1,
                    address: Random.county(),
                },
            ],
        }),
    );
}
