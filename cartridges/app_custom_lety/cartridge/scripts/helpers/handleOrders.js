const OrderMgr = require("dw/order/OrderMgr");
const { ApiLety } = require("*/cartridge/scripts/jobs/api");

const parseDeliveryDateTime = (deliveryDateTime) => {
  let [date, time] = deliveryDateTime.split(" : ");
  let dateTime = new Date(date);
  dateTime.setHours(time);
  return dateTime.toISOString();
};

const hanldeItems = (pli) => {
  let iterator = pli.iterator();
  let items = [];
  let item;
  while (iterator.hasNext()) {
    item = iterator.next();
    items.push({
      iIdMaterial: item.productID,
      dPrecio: item.priceValue,
      iCantidad: item.quantityValue,
    });
  }
  return items;
};

const sendOrderToERP = (orderId) => {
  let order = OrderMgr.getOrder(orderId);
  let paymentInstruments = order.getPaymentInstruments();
  let pi = paymentInstruments[0];
  let today = new Date();
  let payload = {
    Empresa: "1",
    sFolio: orderId,
    sFolioBanco: pi.paymentTransaction.transactionID,
    sFolioTarjeta:
      pi.creditCardNumberLastDigits || pi.paymentTransaction.transactionID,
    iIdCentro: order.custom.storeId,
    dtFechaColocacion: today.toISOString(),
    dtFechaAsignacion: parseDeliveryDateTime(order.custom.deliveryDateTime),
    bindImpreso: false,
    iIdFormaDePago: 3,
    bdMonto: order.totalNetPrice.value,
    dMontoExtranjero: 0,
    iIdMembresia: 0,
    sReferencia: order.UUID,
    dMontoLetyPesos: 0,
    items: hanldeItems(order.productLineItems),
  };

  const response = ApiLety("InsertaDatosVentaWeb", payload);
  let a = today.getDate();
};

module.exports = {
  sendOrderToERP: sendOrderToERP,
};
