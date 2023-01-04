const OrderMgr = require("dw/order/OrderMgr");
const { ApiLety } = require("~/cartridge/scripts/jobs/api");
const functionsSoap = require("~/cartridge/scripts/jobs/functionsSoap");
const Logger = require("dw/system/Logger");
const Site = require("dw/system/Site");
const StoreMgr = require("dw/catalog/StoreMgr");

const parseDeliveryDateTime = (deliveryDateTime) => {
  let [date, time] = deliveryDateTime.split(" : ");
  let dateTime = new Date(date);
  dateTime.setHours(time);
  return dateTime.toISOString();
};

const handleItemsServDom = (pli, shipment) => {
  let iterator = pli.iterator();
  let items = [];
  let item;
  while (iterator.hasNext()) {
    item = iterator.next();
    items.push({
      iIdMaterial: item.productID,
      dPrecio: item.priceValue,
      dPrecioBase: item.basePrice.value,
      dCantidad: item.quantityValue,
      dCantidadBase: item.quantityValue,
      iIdUnidad: 0,
      iIdUnidadBase: 0,
      dPorcDescuento: 0,
      dMontoDescuento: 0,
      dPorcIVA: 0,
      dMontoIVA: 0,
      dPorcIEPS: 0,
      dMontoIEPS: 0,
      iIdCombo: 0,
    });
  }
  items.push({
    iIdMaterial: 12336,
    dPrecio: shipment.adjustedShippingTotalPrice.value,
    dPrecioBase: shipment.adjustedShippingTotalPrice.value,
    dCantidad: 1,
    dCantidadBase: 1,
    iIdUnidad: 0,
    iIdUnidadBase: 0,
    dPorcDescuento: 0,
    dMontoDescuento: 0,
    dPorcIVA: 0,
    dMontoIVA: 0,
    dPorcIEPS: 0,
    dMontoIEPS: 0,
    iIdCombo: 0,
  });

  return items;
};

const handleItemsPickup = (pli) => {
  let iterator = pli.iterator();
  let items = [];
  let item;
  while (iterator.hasNext()) {
    item = iterator.next();
    items.push({
      iIdMaterial: item.productID,
      dPrecio: item.basePrice.value,
      iCantidad: item.quantityValue,
    });
  }
  return items;
};

const handleLetyPuntosAfterInsert = (letyPuntos, folio) => {
  if (letyPuntos.hasCard && letyPuntos.hasAmount) {
    let payload = {
      Empresa: "1",
      s_IdMembresia: letyPuntos.card,
      dMonto: letyPuntos.amount,
      sFolioWeb: folio,
    };
    ApiLety("getLetyClubQuitarPuntos", payload);
  }
};

const handleLetyPuntosCard = (order) => {
  let exist = false;
  let card = 0;
  if (order.custom.letyPuntosCard) {
    exist = true;
    card = order.custom.letyPuntosCard;
  } else if (order.customer.profile) {
    if (order.customer.profile.custom.letyPuntosCard) {
      exist = true;
      card = order.customer.profile.custom.letyPuntosCard;
    }
  }
  return { exist: exist, card: card };
};

const handleLetyPuntos = (order) => {
  let letyPuntosAmount = 0;
  let letyPuntosCard = handleLetyPuntosCard(order);

  let hasLetyPuntosAmount = order.custom.letyPuntosAmount ? true : false;
  try {
    if (hasLetyPuntosAmount) {
      letyPuntosAmount = order.custom.letyPuntosAmount;
    }
  } catch (error) {
    letyPuntosAmount = 0;
  }
  return {
    card: letyPuntosCard.card,
    amount: letyPuntosAmount,
    hasCard: letyPuntosCard.exist,
    hasAmount: hasLetyPuntosAmount,
  };
};

const handleErrorOrder = (type, payload) => {
  const logger = Logger.getLogger("ERP_Orders", "ERP_Orders");
  const bodyXML = functionsSoap.body(
    payload,
    { user: "hidden", password: "hidden" },
    type
  );
  logger.error("Pickup error. payload: {0}", bodyXML);
};

const sendShippingOrderToERP = (orderId) => {
  let status = {};
  let order = OrderMgr.getOrder(orderId);
  let paymentInstruments = order.getPaymentInstruments();
  let pi = paymentInstruments[0];

  let hoursDifferenceFromGMT = Site.getCurrent().getCustomPreferenceValue(
    "hoursDifferenceFromGMT"
  );

  let today = new Date();
  today.setHours(today.getHours() + hoursDifferenceFromGMT);

  let letyPuntos = handleLetyPuntos(order);

  let store = StoreMgr.getStore(order.custom.storeId);

  let payload = {
    IdEmpresa: store.custom.empresaId,
    iIdCentroAlta: 0,
    iIdServDom: 0,
    iIdCentroAfecta: order.custom.storeId,
    iIdFolioPersona: 90000,
    iIdFolioDireccion: order.custom.folioDireccion,
    dtFechaAlta: today.toISOString(),
    dtFechaEntrega: parseDeliveryDateTime(order.custom.deliveryDateTime),
    iIdUsuarioAlta: 1,
    bIndFactura: false,
    sObservaciones: orderId,
    items: handleItemsServDom(order.productLineItems, order.defaultShipment),
    iIdFormaDePago: 3,
    dMonto: order.totalNetPrice.value,
    TipoDeCambio: 1,
    dImporte: 0,
    sFolioTarjeta: pi.paymentTransaction.transactionID,
    dMontoLetyPesos: letyPuntos.amount,
    NombreCompleto: order.customerName,
    Municipio: order.defaultShipment.shippingAddress.postalCode,
    Estado: order.defaultShipment.shippingAddress.stateCode,
    deliveryEstimateId: order.custom.shippingCostId,
  };

  const response = ApiLety("RegistraServDom", payload);
  if (!response.error) {
    handleLetyPuntosAfterInsert(letyPuntos, orderId);
  } else {
    handleLogOrderError("RegistraServDom", payload);
    status.message = response.message;
    status.error = true;
  }
  return status;
};

const sendPickupOrderToERP = (orderId) => {
  let status = {};
  let order = OrderMgr.getOrder(orderId);
  let paymentInstruments = order.getPaymentInstruments();
  let pi = paymentInstruments[0];
  let hoursDifferenceFromGMT = Site.getCurrent().getCustomPreferenceValue(
    "hoursDifferenceFromGMT"
  );
  let today = new Date();
  today.setHours(today.getHours() + hoursDifferenceFromGMT);

  let letyPuntos = handleLetyPuntos(order);

  let store = StoreMgr.getStore(order.custom.storeId);

  let payload = {
    Empresa: store.custom.empresaId,
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
    iIdMembresia: letyPuntos.card,
    sReferencia: order.UUID,
    dMontoLetyPesos: letyPuntos.amount,
    items: handleItemsPickup(order.productLineItems),
  };

  const response = ApiLety("InsertaDatosVentaWeb", payload);
  if (!response.error) {
    handleLetyPuntosAfterInsert(letyPuntos, orderId);
  } else {
    handleLogOrderError("InsertaDatosVentaWeb", payload);
    status.message = response.message;
    status.error = true;
  }
  return status;
};

module.exports = {
  sendPickupOrderToERP: sendPickupOrderToERP,
  sendShippingOrderToERP: sendShippingOrderToERP,
};
