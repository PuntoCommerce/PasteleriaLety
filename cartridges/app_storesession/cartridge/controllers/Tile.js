const server = require("server");
server.extend(module.superModule);

var ProductInventoryMgr = require("dw/catalog/ProductInventoryMgr");
const StoreMgr = require("dw/catalog/StoreMgr");

server.append("Show", (req, res, next) => {
  const viewData = res.getViewData();
  const storeId = req.session.raw.privacy.storeId;

  if (storeId) {
    const store = StoreMgr.getStore(storeId);
    const inventoryListId = store.custom.inventoryListId;
    if (inventoryListId) {
      viewData.hasStoreAssigned = true;
      const inventory = ProductInventoryMgr.getInventoryList(inventoryListId);
      const inventoryRecord = inventory.getRecord(viewData.product.id);
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
});

module.exports = server.exports();
