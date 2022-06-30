import nc from 'next-connect';
import User from "../../../models/User";
import SSLCommerz from "sslcommerz-nodejs";
import {ssl_settings} from "./index";

const handler = nc();

handler.post(async (req, res) => {
    console.log('the ipn request body: ', req?.body);
    let userInfo = await User.findById(req?.query?.user_id);
    if(!userInfo) {
        return res.status(422).json({
            failure: true
        })
    }

    if(!(req?.body?.tran_id && req?.query?.user_id && req.body.val_id)) {
        return res.status(422).json({
            failure: true
        })
    }

    try{
        let sslcommerz = new SSLCommerz(ssl_settings);
        const validationResponse = await sslcommerz.validate_transaction_order(req.body.val_id);

        if (!(validationResponse && (validationResponse.status === 'VALID' || validationResponse.status === 'VALIDATED'))) {
            return res.status(422).json({
                failure: true
            });
        }

        if (validationResponse?.amount != totalAmount) {
            throw new Error('Paid amount and order amount are different.');
        }


    }catch (error) {
        console.log('the error in ipn: ', error);
    }
});

export default handler;
