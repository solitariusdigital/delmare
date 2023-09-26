const soap = require("soap");
const moment = require("moment");
moment.locale("en");

import { generateInvoice } from "../../services/generateInvoice";

const mellatWsdl = "https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl";
const PgwSite = "https://bpm.shaparak.ir/pgwchannel/startpay.mellat";
const callbackUrl = "https://delmareh.com/confirmation";
const terminalId = process.env.MELLAT_TERMINAL_ID;
const userName = process.env.MELLAT_USERNAME;
const password = process.env.MELLAT_PASSWORD;

function desribtionStatusCode(statusCode) {
  switch (statusCode) {
    case 0:
      return "ﺗﺮاﻛﻨﺶ_ﺑﺎ_ﻣﻮﻓﻘﻴﺖ_اﻧﺠﺎم_ﺷﺪ";
    case 11:
      return "ﺷﻤﺎره_ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 12:
      return "ﻣﻮﺟﻮدي_ﻛﺎﻓﻲ_ﻧﻴﺴﺖ";
    case 13:
      return "رﻣﺰ_ﻧﺎدرﺳﺖ_اﺳﺖ";
    case 14:
      return "ﺗﻌﺪاد_دﻓﻌﺎت_وارد_ﻛﺮدن_رﻣﺰ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ";
    case 15:
      return "ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 16:
      return "دﻓﻌﺎت_ﺑﺮداﺷﺖ_وﺟﻪ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ";
    case 17:
      return "ﻛﺎرﺑﺮ_از_اﻧﺠﺎم_ﺗﺮاﻛﻨﺶ_ﻣﻨﺼﺮف_ﺷﺪه_اﺳﺖ";
    case 18:
      return "ﺗﺎرﻳﺦ_اﻧﻘﻀﺎي_ﻛﺎرت_ﮔﺬﺷﺘﻪ_اﺳﺖ";
    case 19:
      return "ﻣﺒﻠﻎ_ﺑﺮداﺷﺖ_وﺟﻪ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ";
    case 111:
      return "ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 112:
      return "ﺧﻄﺎي_ﺳﻮﻳﻴﭻ_ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت";
    case 113:
      return "ﭘﺎﺳﺨﻲ_از_ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت_درﻳﺎﻓﺖ_ﻧﺸﺪ";
    case 114:
      return "دارﻧﺪه_ﻛﺎرت_ﻣﺠﺎز_ﺑﻪ_اﻧﺠﺎم_اﻳﻦ_ﺗﺮاﻛﻨﺶ_ﻧﻴﺴﺖ";
    case 21:
      return "ﭘﺬﻳﺮﻧﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 23:
      return "ﺧﻄﺎي_اﻣﻨﻴﺘﻲ_رخ_داده_اﺳﺖ";
    case 24:
      return "اﻃﻼﻋﺎت_ﻛﺎرﺑﺮي_ﭘﺬﻳﺮﻧﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 25:
      return "ﻣﺒﻠﻎ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 31:
      return "ﭘﺎﺳﺦ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 32:
      return "ﻓﺮﻣﺖ_اﻃﻼﻋﺎت_وارد_ﺷﺪه_ﺻﺤﻴﺢ_ﻧﻤﻲ_ﺑﺎﺷﺪ";
    case 33:
      return "ﺣﺴﺎب_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 34:
      return "ﺧﻄﺎي_ﺳﻴﺴﺘﻤﻲ";
    case 35:
      return "ﺗﺎرﻳﺦ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 41:
      return "ﺷﻤﺎره_درﺧﻮاﺳﺖ_ﺗﻜﺮاري_اﺳﺖ";
    case 42:
      return "ﺗﺮاﻛﻨﺶ_Sale_یافت_نشد_";
    case 43:
      return "ﻗﺒﻼ_Verify_درﺧﻮاﺳﺖ_داده_ﺷﺪه_اﺳﺖ";
    case 44:
      return "درخواست_verify_یافت_نشد";
    case 45:
      return "ﺗﺮاﻛﻨﺶ_Settle_ﺷﺪه_اﺳﺖ";
    case 46:
      return "ﺗﺮاﻛﻨﺶ_Settle_نشده_اﺳﺖ";
    case 47:
      return "ﺗﺮاﻛﻨﺶ_Settle_یافت_نشد";
    case 48:
      return "تراکنش_Reverse_شده_است";
    case 49:
      return "تراکنش_Refund_یافت_نشد";
    case 412:
      return "شناسه_قبض_نادرست_است";
    case 413:
      return "ﺷﻨﺎﺳﻪ_ﭘﺮداﺧﺖ_ﻧﺎدرﺳﺖ_اﺳﺖ";
    case 414:
      return "سازﻣﺎن_ﺻﺎدر_ﻛﻨﻨﺪه_ﻗﺒﺾ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 415:
      return "زﻣﺎن_ﺟﻠﺴﻪ_ﻛﺎري_ﺑﻪ_ﭘﺎﻳﺎن_رسیده_است";
    case 416:
      return "ﺧﻄﺎ_در_ﺛﺒﺖ_اﻃﻼﻋﺎت";
    case 417:
      return "ﺷﻨﺎﺳﻪ_ﭘﺮداﺧﺖ_ﻛﻨﻨﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 418:
      return "اﺷﻜﺎل_در_ﺗﻌﺮﻳﻒ_اﻃﻼﻋﺎت_ﻣﺸﺘﺮي";
    case 419:
      return "ﺗﻌﺪاد_دﻓﻌﺎت_ورود_اﻃﻼﻋﺎت_از_ﺣﺪ_ﻣﺠﺎز_ﮔﺬﺷﺘﻪ_اﺳﺖ";
    case 421:
      return "IP_نامعتبر_است";
    case 51:
      return "ﺗﺮاﻛﻨﺶ_ﺗﻜﺮاري_اﺳﺖ";
    case 54:
      return "ﺗﺮاﻛﻨﺶ_ﻣﺮﺟﻊ_ﻣﻮﺟﻮد_ﻧﻴﺴﺖ";
    case 55:
      return "ﺗﺮاﻛﻨﺶ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ";
    case 61:
      return "ﺧﻄﺎ_در_واریز";
  }
  return "";
}

function bpPayRequest(orderId, priceAmount, additionalText, callbackUrl) {
  const localDate = moment().format("YYYYMMDD");
  const localTime = moment().format("HHmmss");
  const args = {
    terminalId: terminalId,
    userName: userName,
    userPassword: password,
    orderId: orderId,
    amount: priceAmount,
    localDate: localDate,
    localTime: localTime,
    additionalData: additionalText,
    callBackUrl: callbackUrl,
    payerId: 0,
  };

  let options = {
    overrideRootElement: {
      namespace: "ns1",
    },
  };

  return new Promise((resolve, reject) => {
    soap.createClient(mellatWsdl, options, (err, client) => {
      client.bpPayRequest(args, (err, result, body) => {
        if (err) {
          reject(err);
        }
        return resolve(result);
      });
    });
  });
}

function bpVerifyRequest(orderId, saleOrderId, saleReferenceId) {
  const args = {
    terminalId: terminalId,
    userName: userName,
    userPassword: password,
    orderId: orderId,
    saleOrderId: saleOrderId,
    saleReferenceId: saleReferenceId,
  };

  let options = {
    overrideRootElement: {
      namespace: "ns1",
    },
  };

  return new Promise((resolve, reject) => {
    soap.createClient(mellatWsdl, options, (err, client) => {
      client.bpVerifyRequest(args, (err, result, body) => {
        if (err) {
          reject(err);
        }
        return resolve(result);
      });
    });
  });
}

function bpInquiryRequest(orderId, saleOrderId, saleReferenceId) {
  const args = {
    terminalId: terminalId,
    userName: userName,
    userPassword: password,
    orderId: orderId,
    saleOrderId: saleOrderId,
    saleReferenceId: saleReferenceId,
  };

  let options = {
    overrideRootElement: {
      namespace: "ns1",
    },
  };

  return new Promise((resolve, reject) => {
    soap.createClient(mellatWsdl, options, (err, client) => {
      client.bpInquiryRequest(args, (err, result, body) => {
        if (err) {
          reject(err);
        }
        return resolve(result);
      });
    });
  });
}

function bpSettleRequest(orderId, saleOrderId, saleReferenceId) {
  const args = {
    terminalId: terminalId,
    userName: userName,
    userPassword: password,
    orderId: orderId,
    saleOrderId: saleOrderId,
    saleReferenceId: saleReferenceId,
  };

  let options = {
    overrideRootElement: {
      namespace: "ns1",
    },
  };

  return new Promise((resolve, reject) => {
    soap.createClient(mellatWsdl, options, (err, client) => {
      client.bpSettleRequest(args, (err, result, body) => {
        if (err) {
          reject(err);
        }
        return resolve(result);
      });
    });
  });
}

function bpReversalRequest(orderId, saleOrderId, saleReferenceId) {
  const args = {
    terminalId: terminalId,
    userName: userName,
    userPassword: password,
    orderId: orderId,
    saleOrderId: saleOrderId,
    saleReferenceId: saleReferenceId,
  };

  let options = {
    overrideRootElement: {
      namespace: "ns1",
    },
  };

  return new Promise((resolve, reject) => {
    soap.createClient(mellatWsdl, options, (err, client) => {
      client.bpReversalRequest(args, (err, result, body) => {
        if (err) {
          reject(err);
        }
        return resolve(result);
      });
    });
  });
}

async function reversePay(orderId, saleOrderId, saleReferenceId) {
  let resultReversePay = await bpReversalRequest(
    orderId,
    saleOrderId,
    saleReferenceId
  );
  resultReversePay = resultReversePay.return;
  console.log(resultReversePay);
}

export default async function mellatHandler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      return pay(req, res);
    case "POST":
      return callBackCheck(req, res);
  }
}

async function pay(req, res) {
  const credit = parseInt(req.query.credit);
  const orderId = moment().valueOf();

  let payRequestResult = await bpPayRequest(
    parseInt(orderId),
    credit,
    "ok",
    callbackUrl
  );
  payRequestResult = payRequestResult.return;
  console.log(payRequestResult);
  payRequestResult = payRequestResult.split(",");

  if (parseInt(payRequestResult[0]) === 0) {
    return res.json({
      bank_url: PgwSite,
      RefId: payRequestResult[1],
    });
  } else {
    if (payRequestResult[0] === null) {
      const error = "هیچ شماره پیگیری برای پرداخت از سمت بانک ارسال نشده است";
      console.log(error);
      return res.json({ error });
    } else {
      const error = desribtionStatusCode(parseInt(payRequestResult)).replace(
        /_/g,
        " "
      );
      console.log(error);
      return res.json({ error });
    }
  }
}

async function callBackCheck(req, res) {
  let saleReferenceId = -999;
  let saleOrderId = -999;
  let resultCode_bpPayRequest;
  let currentUser = req.body.currentUser;
  let shoppingCart = req.body.shoppingCart;
  let loyaltyPoint = req.body.loyaltyPoint;

  saleReferenceId = parseInt(req.body.SaleReferenceId, 10);
  saleOrderId = parseInt(req.body.SaleOrderId, 10);
  resultCode_bpPayRequest = parseInt(req.body.ResCode);

  // Result Code
  let resultCode_bpinquiryRequest = "-9999";
  let resultCode_bpSettleRequest = "-9999";
  let resultCode_bpVerifyRequest = "-9999";

  if (resultCode_bpPayRequest === 0) {
    // verify request
    resultCode_bpVerifyRequest = await bpVerifyRequest(
      saleOrderId,
      saleOrderId,
      saleReferenceId
    );
    resultCode_bpVerifyRequest = resultCode_bpVerifyRequest.return;
    console.log("bpVerifyRequest:" + resultCode_bpVerifyRequest);

    if (
      resultCode_bpVerifyRequest === null ||
      resultCode_bpVerifyRequest.length === 0
    ) {
      // Inquiry Request
      resultCode_bpinquiryRequest = await bpInquiryRequest(
        saleOrderId,
        saleOrderId,
        saleReferenceId
      );
      resultCode_bpinquiryRequest = parseInt(
        resultCode_bpinquiryRequest.return
      );
      console.log("bpinquiryRequest:" + resultCode_bpinquiryRequest);

      if (resultCode_bpinquiryRequest !== 0) {
        reversePay(saleOrderId, saleOrderId, saleReferenceId);
        const error = desribtionStatusCode(resultCode_bpinquiryRequest);
        console.log("reversePay", error);
        return res.json({ error });
      }
    }

    if (
      parseInt(resultCode_bpVerifyRequest) === 0 ||
      resultCode_bpinquiryRequest === 0
    ) {
      // SettleRequest
      resultCode_bpSettleRequest = await bpSettleRequest(
        saleOrderId,
        saleOrderId,
        saleReferenceId
      );
      resultCode_bpSettleRequest = parseInt(resultCode_bpSettleRequest.return);
      console.log("bpSettleRequest:" + saleReferenceId);
      // Success
      if (
        resultCode_bpSettleRequest === 0 ||
        resultCode_bpSettleRequest === 45
      ) {
        let success = await generateInvoice(
          currentUser,
          shoppingCart,
          loyaltyPoint,
          saleReferenceId
        );
        return res.json({
          code: success,
          refId: saleReferenceId,
        });
      }
    } else {
      if (saleOrderId != -999 && saleReferenceId != -999) {
        if (resultCode_bpPayRequest !== 17)
          reversePay(saleOrderId, saleOrderId, saleReferenceId);
      }
      const error = desribtionStatusCode(resultCode_bpVerifyRequest);
      console.log("reversePay", error);
      return res.json({ error });
    }
  } else {
    if (saleOrderId != -999 && saleReferenceId != -999) {
      if (resultCode_bpPayRequest !== 17)
        reversePay(saleOrderId, saleOrderId, saleReferenceId);
      const error = desribtionStatusCode(resultCode_bpPayRequest);
      console.log("reversePay", error);
      return res.json({ error });
    }
  }
}
