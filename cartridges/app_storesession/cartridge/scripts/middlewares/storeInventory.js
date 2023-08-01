var ProductInventoryMgr = require("dw/catalog/ProductInventoryMgr");
const StoreMgr = require("dw/catalog/StoreMgr");

const checkInventory = (req, res, next) => {
  const viewData = res.getViewData();
  let productId;
  if (viewData.product) {
    productId = viewData.product.id;
  } else {
    productId = req.querystring.pid;
  }

  const storeId = req.session.raw.privacy.storeId;

  if (storeId) {
    const store = StoreMgr.getStore(storeId);
    const inventoryListId = store.custom.inventoryListId || store.inventoryListID;
    if (inventoryListId) {
      session.custom.inventoryListID = inventoryListId;
      viewData.hasStoreAssigned = true;
      const inventory = ProductInventoryMgr.getInventoryList(inventoryListId);
      const inventoryRecord = inventory.getRecord(productId);
      if (inventoryRecord) {
        inventoryRecord.perpetual
          ? (viewData.hasInventoryOn = true)
          : (viewData.hasInventoryOn = inventoryRecord.ATS > 0 ? true : false);
      } else {
        viewData.hasInventoryOn = false;
      }
      res.setViewData(viewData);
    }
  }
  next();
};

module.exports = {
  checkInventory: checkInventory,
};
