const concatenateAddress = (shipment) => {
  let address1 = shipment.shippingAddress.addressFields.address1.value;
  let noExterior = shipment.shippingAddress.addressFields.noExterior.value;
  let noInterior = shipment.shippingAddress.addressFields.noInterior.value;

  let finalAddress = address1 + " No. " + noExterior;
  if (noInterior) {
    finalAddress += " Int. " + noInterior;
  }
  shipment.shippingAddress.addressFields.address1.value = finalAddress;
};

const splitAddress = (address1) => {
  let address = address1.address1
  let numExt = address1.numeroExterior
  
  let concat = address + ' No. ' + numExt;

  let street = "";
  let noExt = "";
  let noInt = "";

  try {
    let lowerAddress = concat.toLowerCase();
    let splitedAddress = lowerAddress.split(" no. ");
    if (splitedAddress.length == 2) {
      street = splitedAddress[0];
      let splitedNumbers = splitedAddress[1].split(" ext. ");
      if (splitedNumbers.length == 1) {
        noExt = splitedAddress[1];
      } else {
        noExt = splitedNumbers[0];
        noInt = splitedNumbers[1];
      }
    }
  } catch (error) {
    street = concat;
    noExt = "N/A";
    noInt = "N/A";
  }
  return {
    street: street,
    noExt: noExt,
    noInt: noInt,
  };
};

module.exports = {
  concatenateAddress: concatenateAddress,
  splitAddress: splitAddress,
};
