# Special Orders #

### Table Content ###
1. [Special Orders](#special-orders)
2. [Cart Controller](#cart-controller)

    2.1 [Inventory](#inventory)

    2.2 [Check Inventory](#check-inventory)

    2.3 [Handle Exist](#handle-exist)

Special orders is a new integration in Pasteleria Lety, here you can
add a custom cakes with differents attributes as `size`, `flavor`, `image`,
`custom message` and others.
### Cart Controller ###

Cart controller manage the fluency according to the basket, this controller is used when you
want to `add` or `remove` a product in the cart or `update` the cart cuantity, even is used to
show the cart section in the project.

Now we need to check the action `AddProduct` in the controller, this action has a middleware to check
the inventory when you add a product.

```javascript
//structure
server.replace(action, middlewares, callback);

//adding the values
server.replace('AddProduct', inventory.checkOnlineInventory, function (req, res, next) {})
```
### Inventory ### 

#### Check Inventory #### 

We need to check our inventory to be able to add the product in the cart, we have a function `checkOnlineInventory`
this function is called in the controller as a middleware, it receive the `req, res, next` values like the main controller,
so, now we can use this three params to check the `quantity`, `storeID` and `productID`.

Once that we have this values and even a extra values as **store Information** and **current basket** we use a handle to
call the inventory endpoint:

```javascript
let existencia = handleExistenciaCall(
    pid,
    quantity,
    storeId,
    store.custom.empresaId
  );
```

#### Handle Exist #### 

We use two kind of intenvory one is the `Commerce Inventory` and the second one
is `Evo Inventory`, this two inventories is used in both kind of cakes (`special and normals`).

You can found a `inventory.js` that is located on _`app_custom_lety > cartridge > scripts > middlewares`_.

As you can see in the file contains a function with name `handleExistenciaCall`, this function checks a 
custom attribute in the product using the class `ProductMgr`. 
After that, we call the endpoint that is provider from the client according to the product type.

_[Endpoint Documentation](endpoints.md)_

```javascript
let productType = ProductMgr.getProduct(pid).custom.tipoproducto

if (productType === 'pedido especial') {
    existencia = ApiLety("ExistenciaPorCentroFechaEsp", {
      Empresa: empresaId,
      iIdMaterial: pid,
      iIdCentro: parseInt(storeId),
      dtFecha: today.toISOString(),
      productType: productType
    });
  } else {
    existencia = ApiLety("ExistenciaPorCentroFecha", {
      Empresa: empresaId,
      iIdMaterial: parseInt(pid),
      iIdCentro: parseInt(storeId),
      dtFecha: today.toISOString(),
      productType: productType
    });
  }
```

We send the params that is required in the endpoint to check if the product exist in `Evolution`.