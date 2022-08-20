"use strict";

const server = require("server");
server.extend(module.superModule);

const CustomObjectMgr = require("dw/object/CustomObjectMgr");

server.get("AverageV2", (req, res, next) => {
  const product = req.querystring.product_id;

  if (!product) {
    res.render("RnR/averageWithOpinion", {
      average: 0,
      total: 0,
    });
    next();
  } else {
    let count = 0;
    let object = CustomObjectMgr.queryCustomObjects(
      "reviews_and_ratings",
      "custom.product_id={0} AND custom.is_visible={1}",
      "creationDate desc",
      product,
      true
    );

    while (object.hasNext()) {
      let item = object.next();
      count += item.custom.rate;
    }

    res.render("RnR/averageWithOpinion", {
      average: object.count == 0 ? 0 : count / object.count,
      total: object.count,
    });

    next();
  }
});

module.exports = server.exports();