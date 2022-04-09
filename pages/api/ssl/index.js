import nc from 'next-connect';
import db from "../../../utils/db";
import {isAuth} from "../../../utils/auth";
import SSLCommerz from "sslcommerz-nodejs";
import TransactionLog from "../../../models/TransactionLog";
import {STATUS} from "../../../components/common/constants";

const crypto = require("crypto");

const handler = nc();
handler.use(isAuth);


const settings = {
    isSandboxMode: true, //false if live version
    store_id: process.env.SSLCOMMERZ_STORE_ID,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
}

handler.post(async (req, res) => {
    await db.connect();
    let num_of_item = 0;

    req?.body?.orderItems?.map(item => {
        num_of_item += item?.quantity;
    })

    let product_name = '';

    req?.body?.orderItems?.map(item => {
        product_name += item?.name + ', ';
    })

    const unique_id = crypto.randomBytes(16).toString("hex");
    let sslcommerz = new SSLCommerz(settings);

    let post_body = {};
    post_body['total_amount'] = req?.body?.totalPrice;
    post_body['currency'] = "BDT";
    post_body['product_name'] = product_name;
    post_body['tran_id'] = unique_id;
    post_body['success_url'] = `${process.env.ROOT_URL}/success`;
    post_body['fail_url'] = `${process.env.ROOT_URL}/fail`;
    post_body['cancel_url'] = `${process.env.ROOT_URL}/cancel`;
    post_body['ipn_url'] = `${process.env.ROOT_URL}/api/ssl/ipn`;
    post_body['emi_option'] = 0;
    post_body['cus_name'] = req?.body?.userInfo?.name;
    post_body['cus_email'] = req?.body?.userInfo?.email;
    post_body['cus_phone'] = req?.body?.userInfo?.phone;
    post_body['cus_add1'] = "";
    post_body['cus_city'] = "";
    post_body['cus_country'] = "Bangladesh";
    post_body['shipping_method'] = "NO";
    post_body['multi_card_name'] = ""
    post_body['num_of_item'] = num_of_item;
    post_body['product_category'] = "none";
    post_body['product_profile'] = "general";
    post_body['cus_postcode'] = "";
    post_body['product_type'] = req?.body?.orderItems[0]?.type;

    let transaction_response = await sslcommerz.init_transaction(post_body);

    const newTransactionLog = new TransactionLog({
        userId: req?.body?.userInfo?._id,
        tranId: post_body?.tran_id,
        totalAmount: post_body?.total_amount,
        productName: post_body?.product_name,
        cusName: post_body?.cus_name,
        cusEmail: post_body?.cus_email,
        cusPhone: post_body?.cus_phone,
        numOfItem: post_body?.num_of_item,
        productType: post_body?.product_type,
        transactionStatus: STATUS.PENDING,
        transactionSessionKey: transaction_response?.sessionkey,
        transactionResStatus: transaction_response?.status,
        transactionResFailedReason: transaction_response?.failedreason
    })

    await newTransactionLog.save();

    if (transaction_response?.status == 'SUCCESS') {
        res.send({redirectUrl: transaction_response?.GatewayPageURL});
    } else {
        res.send({message: transaction_response?.failedreason})
    }

});

export default handler;
