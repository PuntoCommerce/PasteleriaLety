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

  let letyPuntosCard = 0;
  let letyPuntosAmount = 0;

  let hasLetyPuntosCard = order.custom.letyPuntosCard ? true : false;
  let hasLetyPuntosAmount = order.custom.letyPuntosAmount ? true : false;
  try {
    if (hasLetyPuntosCard && hasLetyPuntosAmount) {
      letyPuntosCard = parseInt(order.custom.letyPuntosCard);
      letyPuntosAmount = order.custom.letyPuntosAmount;
    }
  } catch (error) {
    letyPuntosCard = 0;
    letyPuntosAmount = 0;
  }

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
    iIdMembresia: letyPuntosCard,
    sReferencia: order.UUID,
    dMontoLetyPesos: letyPuntosAmount,
    items: hanldeItems(order.productLineItems),
  };

  const response = ApiLety("InsertaDatosVentaWeb", payload);
  if (!response.error) {
    if (hasLetyPuntosCard && hasLetyPuntosAmount) {
      let payloadRemoveLetyPuntos = {
        Empresa: "1",
        s_IdMembresia: letyPuntosCard,
        dMonto: letyPuntosAmount,
        sFolioWeb: orderId,
      };
      ApiLety("getLetyClubQuitarPuntos", payloadRemoveLetyPuntos);
    }
  }
};

module.exports = {
  sendOrderToERP: sendOrderToERP,
};
